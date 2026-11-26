import React, { useState } from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  Search,
  Video,
  Images,
  FileText,
  Brain,
  Calculator,
  Layers,
  Grid,
  Headphones,
  GraduationCap,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

import SalesPanel
  from '../../core/components/SalesPanel';

import SalesResourceCard
  from '../../core/components/SalesResourceCard';

const resources = [
  {
    title: 'Videos',
    description:
      'Watch training videos and manufacturing processes.',
    icon: Video,
    to: '/sales/videos',
  },
  {
    title: 'Images',
    description:
      'Identify materials, scrap forms and equipment.',
    icon: Images,
    to: '/sales/images',
  },
  {
    title: 'Text Resources',
    description:
      'Explore guides, playbooks and reference materials.',
    icon: FileText,
    to: '/sales/resources',
  },
  {
    title: 'Interactive Practice',
    description:
      'Build your knowledge through hands-on exercises.',
    icon: Brain,
    to: '/sales/practice',
  },
];

const quickTools = [
  {
    title: 'Pricing Calculator',
    icon: Calculator,
    to: '/sales/pricing',
  },
  {
    title: 'Material Library',
    icon: Layers,
    to: '/sales/materials',
  },
  {
    title: 'Selling Stream Matrix',
    icon: Grid,
    to: '/sales/selling-streams',
  },
  {
    title: 'Mock Calls',
    icon: Headphones,
    to: '/sales/mock-calls',
  },
];

export default function SalesDashboard() {
  const [search, setSearch] = useState('');

  const navigate = useNavigate();

  function handleSearch(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const query = search.trim();

    navigate(
      query
        ? `/sales/materials?q=${encodeURIComponent(query)}`
        : '/sales/materials'
    );
  }

  return (
    <div className="sales-dashboard">

      <div className="sales-page-heading">

        <h1>Sales Enablement Dashboard</h1>

        <p>
          Training, tools, and resources to help you
          source, qualify, and price plastic scrap.
        </p>

      </div>

      <form
        className="sales-dashboard-search"
        onSubmit={handleSearch}
      >

        <Search size={22} />

        <input
          type="search"
          aria-label="Search Material Library"
          placeholder="Search materials, resin types, grades, scrap forms..."
          value={search}
          onChange={event =>
            setSearch(event.target.value)
          }
        />

        <button type="submit">
          Search
        </button>

      </form>

      <div className="sales-resource-grid">

        {resources.map(resource => {
          const Icon = resource.icon;

          return (
            <SalesResourceCard
              key={resource.to}
              title={resource.title}
              description={resource.description}
              icon={<Icon size={29} strokeWidth={1.7} />}
              to={resource.to}
            />
          );
        })}

      </div>

      <div className="sales-dashboard-grid">

        <SalesPanel
          title="My Training Progress"
          linkLabel="View training"
          linkTo="/sales/training"
        >

          <div className="sales-progress-content">

            <div
              className="sales-progress-ring"
              aria-label="No training progress available"
            >
              <strong>—</strong>
              <span>Progress</span>
            </div>

            <div className="sales-progress-details">

              <h3>No courses assigned</h3>

              <p>
                Your training progress will appear here
                once you begin a course.
              </p>

            </div>

          </div>

          <div className="sales-progress-footer">
            Training progress is not yet available.
          </div>

        </SalesPanel>

        <SalesPanel title="Quick Tools">

          <div className="sales-quick-tools">

            {quickTools.map(tool => {
              const Icon = tool.icon;

              return (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="sales-quick-tool"
                >

                  <Icon size={25} strokeWidth={1.7} />

                  <span>{tool.title}</span>

                </Link>
              );
            })}

          </div>

        </SalesPanel>

        <SalesPanel
          title="Recent Content"
          linkLabel="View all"
          linkTo="/sales/resources"
        >

          <div className="sales-empty-state">

            <FileText size={35} strokeWidth={1.4} />

            <h3>No recent content</h3>

            <p>
              Newly published training resources
              will appear here.
            </p>

          </div>

        </SalesPanel>

      </div>

      <SalesPanel
        title="My Learning Path"
        linkLabel="Training catalog"
        linkTo="/sales/training"
      >

        <div className="sales-learning-path">

          <div className="sales-learning-icon">
            <GraduationCap size={32} />
          </div>

          <div className="sales-learning-description">

            <h3>Your learning journey starts here.</h3>

            <p>
              Your assigned courses and learning
              milestones will appear here.
            </p>

          </div>

          <Link
            to="/sales/training"
            className="sales-learning-button"
          >
            <BookOpen size={18} />
            Browse Training
            <ArrowRight size={16} />
          </Link>

        </div>

      </SalesPanel>

    </div>
  );
}