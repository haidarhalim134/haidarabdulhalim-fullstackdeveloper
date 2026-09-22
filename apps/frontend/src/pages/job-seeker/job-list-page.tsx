import * as React from 'react'
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, MapPin } from "lucide-react";

import { getJobs } from "@/lib/api-helper";
import type { Job, JobType } from "@/src/types/job.dto";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const jobTypes: JobType[] = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "FREELANCE",
  "REMOTE",
];

export function JobListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const title = searchParams.get("title") ?? "";
  const location = searchParams.get("location") ?? "";
  const type =
    (searchParams.get("type") as JobType | null) ?? "ALL";

  const [titleInput, setTitleInput] = useState(title);
  const [locationInput, setLocationInput] = useState(location);
  const [typeInput, setTypeInput] =
    useState<JobType | "ALL">(type);

  async function loadJobs() {
    try {
      setLoading(true);
      setError("");

      const result = await getJobs({
        title: title || undefined,
        location: location || undefined,
        type: type === "ALL" ? undefined : type,
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

  useEffect(() => {
    setTitleInput(title);
    setLocationInput(location);
    setTypeInput(type);
    loadJobs();
  }, [title, location, type]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams();

    if (titleInput.trim()) {
      params.set("title", titleInput.trim());
    }

    if (locationInput.trim()) {
      params.set("location", locationInput.trim());
    }

    if (typeInput !== "ALL") {
      params.set("type", typeInput);
    }

    setSearchParams(params);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Find a job
        </h1>

        <p className="text-muted-foreground">
          Search and apply for available jobs.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form
            onSubmit={handleSearch}
            className="grid gap-3 md:grid-cols-[1fr_1fr_200px_auto]"
          >
            <Input
              placeholder="Job title"
              value={titleInput}
              onChange={(e) =>
                setTitleInput(e.target.value)
              }
            />

            <Input
              placeholder="Location"
              value={locationInput}
              onChange={(e) =>
                setLocationInput(e.target.value)
              }
            />

            <Select
              value={typeInput}
              onValueChange={(value) =>
                setTypeInput(value as JobType | "ALL")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Job type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">
                  All types
                </SelectItem>

                {jobTypes.map((jobType) => (
                  <SelectItem
                    key={jobType}
                    value={jobType}
                  >
                    {formatJobType(jobType)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading && (
        <p className="py-10 text-center text-muted-foreground">
          Loading jobs...
        </p>
      )}

      {error && (
        <p className="text-destructive">{error}</p>
      )}

      {!loading && !error && jobs.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No jobs found.
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {jobs.map((job) => (
          <Link
            key={job.id}
            to={`/job-seeker/jobs/${job.id}`}
            className="block"
          >
            <Card className="transition hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>{job.title}</CardTitle>

                    {job.company && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {job.company.companyName}
                      </p>
                    )}
                  </div>

                  <Badge>
                    {formatJobType(job.type)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function formatJobType(type: JobType) {
  return type
    .split("_")
    .map(
      (word) =>
        word.charAt(0) +
        word.slice(1).toLowerCase()
    )
    .join(" ");
}