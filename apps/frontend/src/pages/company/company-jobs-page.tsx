import * as React from 'react'
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getJobs } from "@/lib/api-helper";
import type { Job } from "@/src/types/job.dto";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from '@/src/context/authContext';

export function CompanyJobsPage() {
  const { user } = useAuth()

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const result = await getJobs({
          fromCompany: user?.companyProfile?.id
        });
        setJobs(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load jobs"
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Your jobs
          </h1>

          <p className="text-muted-foreground">
            Manage your job postings.
          </p>
        </div>

        <Button asChild>
          <Link to="/company/jobs/new">
            Create job
          </Link>
        </Button>
      </div>

      {loading && <p>Loading jobs...</p>}

      {error && (
        <p className="text-destructive">{error}</p>
      )}

      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>{job.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {job.location}
                  </p>
                </div>

                <Badge>{job.type}</Badge>
              </div>
            </CardHeader>

            <CardContent>
              <Button asChild variant="outline">
                <Link
                  to={`/company/jobs/${job.id}/applicants`}
                >
                  View applicants
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}