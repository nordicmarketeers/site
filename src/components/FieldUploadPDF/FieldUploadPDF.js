import React, { Component, useState, useEffect, useRef } from 'react';
import { Field } from 'react-final-form';
import classNames from 'classnames';

import css from './FileUploadPDF.module.css';

// Inner functional component (contains all rendering and logic)
const FileUploadPDFComponent = props => {
  const {
    className,
    id,
    name,
    label,
    input, // FinalForm injects this (value, onChange)
    meta,
    intl,
    pendingFiles,
    setPendingFiles,
    toDeletePaths,
    setToDeletePaths,
    pdfUploaderRef, // optional ref passed from parent
    ...rest
  } = props;

  // Parse existing URLs from Sharetribe value (JSON string array)
  const initialUrls = React.useMemo(() => {
    if (!input?.value) return [];
    try {
      const parsed = JSON.parse(input.value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('Invalid value:', input.value);
      return [];
    }
  }, [input?.value]);

  const [displayUrls, setDisplayUrls] = useState(initialUrls);

  // Sync display list when form value changes externally
  useEffect(() => {
    setDisplayUrls(initialUrls);
  }, [initialUrls]);

  const fileInputRef = useRef(null);

  // Helper to update form field with new list (only for existing URLs)
  const updateFormValue = newUrls => {
    input.onChange(JSON.stringify(newUrls));
  };

  const handleAddFiles = selectedFiles => {
    const newFiles = Array.from(selectedFiles);
    const currentTotal = displayUrls.length + pendingFiles.length + newFiles.length;

    if (currentTotal > 7) {
      alert('Maximum 7 PDFs allowed');
      return;
    }

    const validNew = newFiles.filter(file => {
      if (file.type !== 'application/pdf') {
        alert(`File ${file.name} is not a PDF`);
        return false;
      }
      if (file.size > 6 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 6MB`);
        return false;
      }
      return true;
    });

    setPendingFiles(prev => [
      ...prev,
      ...validNew.map(file => ({ file, name: file.name, status: 'idle' })),
    ]);
  };

  const handleRemove = (index, isExisting) => {
    if (isExisting) {
      // Remove from existing (real URLs)
      const newUrls = displayUrls.filter((_, i) => i !== index);
      const removedUrl = displayUrls[index];
      const path = removedUrl.replace(/^https?:\/\/[^/]+\/storage\/v1\/object\/public\/PDF\//, '');
      setToDeletePaths(prev => [...new Set([...prev, path])]);

      setDisplayUrls(newUrls);
      updateFormValue(newUrls);
    } else {
      // Remove from pending
      setPendingFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Expose getFilesData via ref if parent passes pdfUploaderRef
  React.useImperativeHandle(pdfUploaderRef, () => ({
    getFilesData: () => ({
      existingUrls: initialUrls,
      pendingFiles,
      toDeletePaths,
    }),
  }));

  const rootClasses = classNames(css.wrapper, className);

  return (
    <div className={rootClasses}>
      {label && (
        <>
          <label htmlFor={id} className={css.label}>
            {label}
            <br />
            <span className={css.labelSubtitle}>Limit: 7 files, 6MB per file</span>
          </label>
        </>
      )}

      {displayUrls.length === 0 && pendingFiles.length === 0 ? (
        <div className={css.emptyState}>No PDFs added yet</div>
      ) : (
        <div className={css.list}>
          {/* Existing uploaded PDFs (real Supabase URLs) */}
          {displayUrls.map((url, idx) => (
            <div key={`existing-${idx}`} className={css.item}>
              <a href={url} target="_blank" rel="noopener noreferrer">
                {url.split('/').pop() || 'document.pdf'}
              </a>
              <button
                type="button"
                className={css.removeButton}
                onClick={() => handleRemove(idx, true)}
              >
                ×
              </button>
            </div>
          ))}

          {/* Pending / newly added PDFs (show original filename) */}
          {pendingFiles.map((item, idx) => (
            <div key={`pending-${idx}`} className={css.item}>
              <span className={css.filename}>
                {item.name}
                {item.status === 'uploading' && (
                  <span className={css.uploading}> (Uploading...)</span>
                )}
              </span>
              <button
                type="button"
                className={css.removeButton}
                onClick={() => handleRemove(idx, false)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        className={css.addButton}
        onClick={() => fileInputRef.current?.click()}
        disabled={displayUrls.length + pendingFiles.length >= 7}
      >
        Add PDF
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        style={{ display: 'none' }}
        onChange={e => {
          if (e.target.files) handleAddFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {meta?.touched && meta?.error && <div className={css.error}>{meta.error}</div>}
    </div>
  );
};

/**
 * Final Form field wrapper for PDF upload.
 * Matches the pattern of FieldTextInput, FieldSelect, etc.
 *
 * @component
 * @param {Object} props
 * @param {string?} props.className
 * @param {string} props.name
 * @param {string?} props.label
 * @param {string?} props.id
 * @param {Array} props.pendingFiles
 * @param {Function} props.setPendingFiles
 * @param {Array} props.toDeletePaths
 * @param {Function} props.setToDeletePaths
 * @param {React.Ref} props.pdfUploaderRef - ref to expose getFilesData()
 * @returns {JSX.Element}
 */
class FileUploadPDF extends Component {
  componentWillUnmount() {
    if (this.props.onUnmount) {
      this.props.onUnmount();
    }
  }

  render() {
    return <Field component={FileUploadPDFComponent} {...this.props} />;
  }
}

export default FileUploadPDF;
