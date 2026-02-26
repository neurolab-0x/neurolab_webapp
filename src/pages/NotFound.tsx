import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ghost, ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center px-4">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
        <Ghost size={48} className="text-muted-foreground" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">404</h1>
      <h2 className="mt-4 text-xl font-semibold tracking-tight text-foreground">Module Not Found</h2>
      <p className="mt-2 max-w-md text-base text-muted-foreground">
        The requested platform module does not exist or you do not have the required access clearance.
      </p>
      <div className="mt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
        >
          <ArrowLeft size={16} /> Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
