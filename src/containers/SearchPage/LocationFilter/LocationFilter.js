import React, { Component } from 'react';
import classNames from 'classnames';

import { injectIntl, intlShape } from '../../../util/reactIntl';
import { types as sdkTypes } from '../../../util/sdkLoader';

import { FieldLocationAutocompleteInput } from '../../../components';

import FilterPlain from '../FilterPlain/FilterPlain';
import FilterPopup from '../FilterPopup/FilterPopup';

import css from './LocationFilter.module.css';
import { cityFormat } from '../../../util/listingCardHelpers';

const { LatLng, LatLngBounds } = sdkTypes;

const parseLatLng = str => {
  if (!str) return null;
  const [lat, lng] = str.split(',').map(parseFloat);
  return new LatLng(lat, lng);
};

const parseLatLngBounds = str => {
  if (!str) return null;
  const [neLat, neLng, swLat, swLng] = str.split(',').map(parseFloat);
  return new LatLngBounds(new LatLng(neLat, neLng), new LatLng(swLat, swLng));
};

class LocationFilter extends Component {
  constructor(props) {
    super(props);
    this.mobileInputRef = React.createRef();

    const isBrowser = typeof window !== 'undefined';
    const { isSelected, currentCity } = isBrowser
      ? (() => {
          const currentParams = new URLSearchParams(window.location.search);
          const searchParams = Object.fromEntries(currentParams);
          return searchParams.address
            ? { isSelected: true, currentCity: cityFormat(searchParams.address) }
            : { isSelected: false, currentCity: '' };
        })()
      : { isSelected: false, currentCity: '' };

    this.state = { isFocused: false, isSelected, currentCity };
    this.currentSearch = isBrowser ? window.location.search : '';
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', this.handlePopState);
    }
  }

  componentDidUpdate() {
    if (typeof window === 'undefined') return;

    const newSearch = window.location.search;

    if (newSearch !== this.currentSearch) {
      this.currentSearch = newSearch;

      const { isSelected, currentCity } = this.activeCheck();
      this.setState({ isSelected, currentCity });
    }
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('popstate', this.handlePopState);
    }
  }

  handlePopState = () => {
    const { isSelected, currentCity } = this.activeCheck();
    this.setState({ isSelected, currentCity });
  };

  handleFocus = () => {
    this.setState({ isFocused: true });
  };

  handleBlur = () => {
    this.setState({ isFocused: false });
  };

  activeCheck = () => {
    if (typeof window === 'undefined') {
      return { isSelected: false, currentCity: null };
    }

    const currentParams = new URLSearchParams(window.location.search);
    const searchParams = Object.fromEntries(currentParams);
    return searchParams.address
      ? { isSelected: true, currentCity: cityFormat(searchParams.address) }
      : { isSelected: false, currentCity: null };
  };

  render() {
    const {
      id,
      className,
      rootClassName,
      getAriaLabel,
      queryParamNames,
      initialValues: propsInitialValues,
      contentPlacementOffset,
      onSubmit,
      showAsPopup,
      intl,
      ...rest
    } = this.props;

    const label = 'Location';

    const classes = classNames(rootClassName || css.root, className);

    const { isSelected, currentCity } = this.state;
    const labelSelection = isSelected ? '• ' + currentCity : '';
    const propsInitial = propsInitialValues || {};
    const initialAddress = propsInitial.address;
    const initialOrigin = parseLatLng(propsInitial.origin);
    const initialBounds = parseLatLngBounds(propsInitial.bounds);
    const initialSelectedPlace = initialAddress
      ? { address: initialAddress, origin: initialOrigin, bounds: initialBounds }
      : null;
    const formInitialValues = {
      location: {
        search: initialAddress || '',
        predictions: [],
        selectedPlace: initialSelectedPlace,
      },
    };

    const hasInitialValues = !!initialAddress;
    const rawInitialValues = initialAddress;
    const placeholder = intl.formatMessage({ id: 'TopbarSearchForm.placeholder' });

    const handleSubmit = values => {
      if (typeof window === 'undefined') {
        return;
      }

      const { search, selectedPlace } = values.location || {};
      const address = selectedPlace?.address || search?.trim() || null;
      const origin = selectedPlace?.origin
        ? `${selectedPlace.origin.lat},${selectedPlace.origin.lng}`
        : null;
      const bounds = selectedPlace?.bounds
        ? `${selectedPlace.bounds.ne.lat},${selectedPlace.bounds.ne.lng},${selectedPlace.bounds.sw.lat},${selectedPlace.bounds.sw.lng}`
        : null;

      // Preserve everything already in URL
      const currentParams = new URLSearchParams(window.location.search);
      const searchParams = Object.fromEntries(currentParams);

      // Update/add only location params
      if (address) searchParams.address = address;
      if (origin) searchParams.origin = origin;
      if (bounds) searchParams.bounds = bounds;

      // Build new URL
      const newSearch = new URLSearchParams(searchParams).toString();
      const newUrl = `/s${newSearch ? '?' + newSearch : ''}`;

      // console.log('Navigating to:', newUrl);

      window.history.pushState({}, '', newUrl);
      window.dispatchEvent(new PopStateEvent('popstate'));
    };

    const handleClear = () => {
      if (typeof window === 'undefined') {
        return;
      }

      if (this.mobileInputRef && this.mobileInputRef.current) {
        this.mobileInputRef.current.value = '';
      }

      // Build clean URL without location params
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.delete('address');
      currentParams.delete('origin');
      currentParams.delete('bounds');

      const newSearch = currentParams.toString() ? `?${currentParams.toString()}` : '';
      const newUrl = `/s${newSearch}`;

      // console.log('Clearing → reloading with:', newUrl);

      // Hard reload to force full state reset and re-fetch
      window.location.href = newUrl;
    };

    return showAsPopup ? (
      <FilterPopup
        {...rest}
        className={classes}
        rootClassName={rootClassName}
        popupClassName={css.popupSize}
        name="location"
        label={label}
        ariaLabel={getAriaLabel(label, rawInitialValues)}
        isSelected={isSelected}
        labelSelection={labelSelection}
        id={`${id}.popup`}
        showAsPopup
        contentPlacementOffset={contentPlacementOffset}
        onSubmit={values => {
          // Only submit when a real location is selected (ignores typing)
          if (values?.location?.selectedPlace) {
            handleSubmit(values);
          }
        }}
        onClear={handleClear}
        initialValues={formInitialValues}
        keepDirtyOnReinitialize
        onChange={values => {
          if (values?.location?.selectedPlace) {
            handleSubmit(values);
          }
        }}
      >
        <FieldLocationAutocompleteInput
          CustomIcon={() => null}
          ShowCustomIcon={false}
          rootClassName={css.noIconRoot}
          className={css.field}
          name="location"
          id={`${id}-input`}
          placeholder={placeholder}
          autoComplete="off"
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onPlaceSelected={place => {
            if (place) {
              const values = {
                location: {
                  search: place.address,
                  predictions: [],
                  selectedPlace: place,
                },
              };
              handleSubmit(values);
            }
          }}
        />
      </FilterPopup>
    ) : (
      <FilterPlain
        {...rest}
        className={className}
        rootClassName={rootClassName}
        label={label}
        ariaLabel={getAriaLabel(label, rawInitialValues)}
        isSelected={isSelected}
        labelSelection={labelSelection}
        id={`${id}.plain`}
        liveEdit={false}
        onSubmit={values => {
          // Only submit when a real location is selected (ignores typing)
          if (values?.location?.selectedPlace) {
            handleSubmit(values);
          }
        }}
        onClear={handleClear}
        initialValues={formInitialValues}
        onChange={values => {
          if (values?.location?.selectedPlace) {
            handleSubmit(values);
          }
        }}
      >
        <div className={css.fieldPlain}>
          <FieldLocationAutocompleteInput
            CustomIcon={() => null}
            ShowCustomIcon={false}
            rootClassName={css.noIconRoot}
            name="location"
            id={`${id}-input`}
            inputRef={this.mobileInputRef}
            className={css.fieldPlainInput}
            placeholder={placeholder}
            autoComplete="off"
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onPlaceSelected={place => {
              if (place) {
                const values = {
                  location: {
                    search: place.address,
                    predictions: [],
                    selectedPlace: place,
                  },
                };
                handleSubmit(values);
              }
            }}
          />
        </div>
      </FilterPlain>
    );
  }
}

LocationFilter.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(LocationFilter);
