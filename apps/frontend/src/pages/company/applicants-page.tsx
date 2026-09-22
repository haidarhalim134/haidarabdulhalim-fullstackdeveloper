import * as React from 'react'
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import {
  getJobApplicants,
  updateApplicationStatus,
} from "@/lib/api-helper";

import type {
  Application,
  ApplicationStatus,
} from "@/src/types/job.dto";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statuses: ApplicationStatus[] = [
  "APPLIED",
  "REVIEWING",
  "SHORTLISTED",
  "REJECTED",
  "ACCEPTED",
];

export function ApplicantsPage() {
  const { jobId } = useParams<{ jobId: string }>();

  const [applications, setApplications] =
    useState<Application[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!jobId) return;

    async function load() {
      try {
        const result =
          await getJobApplicants(jobId);

        setApplications(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load applicants"
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [jobId]);

  async function handleStatusChange(
    applicationId: string,
    status: ApplicationStatus
  ) {
    try {
      await updateApplicationStatus(
        applicationId,
        status
      );

      setApplications((current) =>
        current.map((application) =>
          application.id === applicationId
            ? {
                ...application,
                status,
              }
            : application
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update status"
      );
    }
  }

  if (!jobId) {
    return <p>Invalid job.</p>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Applicants
        </h1>

        <p className="text-muted-foreground">
          Review applicants and update their status.
        </p>
      </div>

      {loading && <p>Loading applicants...</p>}

      {error && (
        <p className="text-destructive">{error}</p>
      )}

      {!loading &&
        !error &&
        applications.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No applicants yet.
            </CardContent>
          </Card>
        )}

      <div className="space-y-4">
        {applications.map((application) => {
          const applicant =
            application.jobSeekerProfile;

          return (
            <Card key={application.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {applicant?.fullName ??
                        "Applicant"}
                    </CardTitle>

                    {applicant?.phone && (
                      <p className="text-sm text-muted-foreground">
                        {applicant.phone}
                      </p>
                    )}
                  </div>

                  <Badge>
                    {formatStatus(
                      application.status
                    )}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="flex flex-wrap items-center gap-3">
                {applicant?.resumeUrl && (
                  <Button
                    variant="outline"
                    asChild
                  >
                    <a
                      href={applicant.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View resume
                    </a>
                  </Button>
                )}

                <Select
                  value={application.status}
                  onValueChange={(value) =>
                    handleStatusChange(
                      application.id,
                      value as ApplicationStatus
                    )
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem
                        key={status}
                        value={status}
                      >
                        {formatStatus(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function formatStatus(status: ApplicationStatus) {
  return status
    .split("_")
    .map(
      (word) =>
        word.charAt(0) +
        word.slice(1).toLowerCase()
    )
    .join(" ");
}