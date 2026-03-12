import React, { useState, useEffect, useRef } from 'react';

import css from './ListingPage.module.css';

// PDF.js imports
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.7.76/build/pdf.worker.mjs';

const THUMBNAIL_WIDTH = 80;
const THUMBNAIL_HEIGHT = 110;

const SectionPDFMaybe = props => {
  const { text: pdfUrlsRaw, heading = 'Portfolio' } = props;

  let pdfUrls = [];
  try {
    pdfUrls = JSON.parse(pdfUrlsRaw || '[]');
    if (!Array.isArray(pdfUrls)) pdfUrls = [];
  } catch (err) {
    pdfUrls = [];
  }

  if (pdfUrls.length === 0) return null;

  return (
    <section className={css.sectionPDF}>
      {heading && <h2 className={css.sectionHeading}>{heading}</h2>}

      <div className={css.pdfGrid}>
        {pdfUrls.map(url => (
          <a
            key={url}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={css.pdfThumbLink}
          >
            <PDFImage pdfUrl={url} />
          </a>
        ))}
      </div>
    </section>
  );
};

const PDFImage = ({ pdfUrl }) => {
  const canvasRef = useRef(null);
  const [dataUrl, setDataUrl] = useState(null);

  useEffect(() => {
    const renderFirstPage = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({ url: pdfUrl });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 1.0 });
        const scale = Math.min(
          THUMBNAIL_WIDTH / viewport.width,
          THUMBNAIL_HEIGHT / viewport.height
        );

        const scaledViewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;

        await page.render({
          canvasContext: context,
          viewport: scaledViewport,
        }).promise;

        setDataUrl(canvas.toDataURL('image/png'));
        pdf.destroy();
      } catch (err) {
        console.error('PDF render error:', err);
      }
    };

    renderFirstPage();
  }, [pdfUrl]);

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {!dataUrl ? (
        <div className={css.pdfPlaceholder}>
          <div className={css.spinner} />
        </div>
      ) : (
        <img src={dataUrl} alt="PDF preview" className={css.pdfThumbnailImage} />
      )}
    </>
  );
};

export default SectionPDFMaybe;
