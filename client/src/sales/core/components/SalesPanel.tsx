import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  title: string;
  children: React.ReactNode;
  linkLabel?: string;
  linkTo?: string;
  className?: string;
}

export default function SalesPanel({
  title,
  children,
  linkLabel,
  linkTo,
  className = '',
}: Props) {
  return (
    <section
      className={`sales-panel ${className}`}
    >

      <div className="sales-panel-header">

        <h2>{title}</h2>

        {linkLabel && linkTo && (
          <Link to={linkTo}>
            {linkLabel}
          </Link>
        )}

      </div>

      <div className="sales-panel-body">
        {children}
      </div>

    </section>
  );
}