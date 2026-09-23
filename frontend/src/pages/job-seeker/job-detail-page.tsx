import * as React from 'react'
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";

import { applyToJob, getJob } from "@/src/lib/api-helper";
import type { Job } from "@/src/types/job.dto";

import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { useAuth } from '@/src/context/authContext';
import { RoleEnum } from '@/src/types/auth.dto';

export function JobDetailPage() {
  const { user } = useAuth()
  const isJobSeeker = user?.role == RoleEnum.enum.JOB_SEEKER

  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!jobId) return;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const result = await getJob(jobId);
        setJob(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load job"
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [jobId]);

  async function handleApply() {
    if (!jobId) return;

    try {
      setApplying(true);
      setMessage("");

      const result = await applyToJob(jobId);

      setMessage(
        result.message ??
          "Application submitted successfully"
      );
    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : "Failed to apply"
      );
    } finally {
      setApplying(false);
    }
  }

  if (loading) {
    return (
      <div className="py-12 text-center">
        Loading job...
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <p className="text-destructive">
          {error || "Job not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Badge className="mb-3">
                {formatJobType(job.type)}
              </Badge>

              <CardTitle className="text-3xl">
                {job.title}
              </CardTitle>

              {job.company && (
                <p className="mt-2 text-muted-foreground">
                  {job.company.companyName}
                </p>
              )}
            </div>

            {isJobSeeker ? 
              <Button
                  onClick={handleApply}
                  disabled={applying}
                >
                {applying ? "Applying..." : "Apply now"}
              </Button> : null
            }
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {message && (
            <div className="rounded-md bg-muted p-3 text-sm">
              {message}
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {job.location}
          </div>

          <Separator />

          <div>
            <h2 className="mb-3 text-xl font-semibold">
              Description
            </h2>

            <p className="whitespace-pre-wrap leading-7 text-muted-foreground">
              {job.description}
            </p>
          </div>

          {job.company?.website && (
            <Button variant="outline" asChild>
              <a
                href={job.company.website}
                target="_blank"
                rel="noreferrer"
              >
                Company website
              </a>
            </Button>
          )}

          {isJobSeeker ? 
            <div>
              <Link
                to="/job-seeker/applications"
                className="text-sm underline"
              >
                View my applications
              </Link>
            </div> : null
          }
        </CardContent>
      </Card>
    </div>
  );
}

function formatJobType(type: string) {
  return type
    .split("_")
    .map(
      (word) =>
        word.charAt(0) +
        word.slice(1).toLowerCase()
    )
    .join(" ");
}