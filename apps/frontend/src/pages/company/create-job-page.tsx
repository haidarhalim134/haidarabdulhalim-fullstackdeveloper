import * as React from 'react'
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createJob } from "@/lib/api-helper";
import type { JobType } from "@/src/types/job.dto";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

export function CreateJobPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    type: "FULL_TIME" as JobType,
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await createJob({
        title: form.title,
        location: form.location,
        type: form.type,
        description: form.description,

        salaryMin: form.salaryMin
          ? Number(form.salaryMin)
          : undefined,

        salaryMax: form.salaryMax
          ? Number(form.salaryMax)
          : undefined,
      });

      navigate("/company/jobs");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create job"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create job</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <Input
              required
              placeholder="Job title"
              value={form.title}
              onChange={(e) =>
                update("title", e.target.value)
              }
            />

            <Input
              required
              placeholder="Location"
              value={form.location}
              onChange={(e) =>
                update("location", e.target.value)
              }
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                type="number"
                min="0"
                placeholder="Minimum salary"
                value={form.salaryMin}
                onChange={(e) =>
                  update("salaryMin", e.target.value)
                }
              />

              <Input
                type="number"
                min="0"
                placeholder="Maximum salary"
                value={form.salaryMax}
                onChange={(e) =>
                  update("salaryMax", e.target.value)
                }
              />
            </div>

            <Select
              value={form.type}
              onValueChange={(value) =>
                update("type", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {jobTypes.map((type) => (
                  <SelectItem
                    key={type}
                    value={type}
                  >
                    {formatJobType(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Textarea
              required
              rows={10}
              placeholder="Job description"
              value={form.description}
              onChange={(e) =>
                update(
                  "description",
                  e.target.value
                )
              }
            />

            {error && (
              <p className="text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  navigate("/company/jobs")
                }
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Creating..."
                  : "Create job"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
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