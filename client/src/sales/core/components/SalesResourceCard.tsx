import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Props {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
}

export default function SalesResourceCard({
  title,
  description,
  icon,
  to,
}: Props) {
  return (
    <Link
      to={to}
      className="sales-resource-card"
    >

      <div className="sales-resource-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      <div className="sales-resource-link">
        Explore
        <ArrowRight size={15} />
      </div>

    </Link>
  );
}