import * as React from 'react'
import { useEffect, useState } from "react";

import { getMyApplications } from "@/lib/api-helper";
import type { Application } from "@/src/types/job.dto";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function MyApplicationsPage() {
  const [applications, setApplications] =
    useState<Application[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const result = await getMyApplications();
        setApplications(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load applications"
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          My applications
        </h1>

        <p className="text-muted-foreground">
          Track your job applications.
        </p>
      </div>

      {loading && <p>Loading applications...</p>}

      {error && (
        <p className="text-destructive">{error}</p>
      )}

      {!loading &&
        !error &&
        applications.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No applications yet.
            </CardContent>
          </Card>
        )}

      <div className="space-y-4">
        {applications.map((application) => (
          <Card key={application.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>
                    {application.job?.title ??
                      "Job"}
                  </CardTitle>

                  {application.job?.company && (
                    <p className="text-sm text-muted-foreground">
                      {
                        application.job.company
                          .companyName
                      }
                    </p>
                  )}
                </div>

                <Badge>
                  {formatStatus(application.status)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className='flex flex-row justify-between'>
              <Button variant={'ghost'} asChild>
                <Link to={`/application/${application.id}`}>
                  View History
                </Link>
              </Button>

              <p className="text-sm text-muted-foreground">
                Applied{" "}
                {new Date(
                  application.createdAt
                ).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function formatStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}