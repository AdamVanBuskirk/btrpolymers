import React from 'react';
import { Link } from 'react-router-dom';
import { Construction, ArrowLeft } from 'lucide-react';

interface Props {
  title: string;
  description: string;
}

export default function SalesComingSoon({
  title,
  description,
}: Props) {
  return (
    <div>

      <div className="sales-page-heading">

        <h1>{title}</h1>

        <p>{description}</p>

      </div>

      <section className="sales-coming-soon">

        <div className="sales-coming-soon-icon">
          <Construction size={40} strokeWidth={1.5} />
        </div>

        <h2>Coming soon</h2>

        <p>
          We're building this feature as part of the
          BTR Sales Platform. Check back as new
          functionality is released.
        </p>

        <Link to="/sales">
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

      </section>

    </div>
  );
}