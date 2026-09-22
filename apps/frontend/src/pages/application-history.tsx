import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getApplicationStatusHistory } from "@/src/lib/api-helper";
import { ApplicationHistory } from "@/src/types/job.dto";

import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

export default function ApplicationStatusHistoryPage() {
  const { applicationId } = useParams<{
    applicationId: string;
  }>();

  const [history, setHistory] = useState<ApplicationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const result =
          await getApplicationStatusHistory(applicationId!);

        setHistory(
          [...result.data].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          )
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load application status"
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [applicationId]);

  const currentStatus = history[0]?.status;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Application status
        </h1>

        <p className="text-muted-foreground">
          Track the progress of your application.
        </p>
      </div>

      {loading && <p>Loading status history...</p>}

      {error && (
        <p className="text-destructive">{error}</p>
      )}

      {!loading && !error && currentStatus && (
        <Card>
          <CardHeader>
            <CardTitle>Current status</CardTitle>
          </CardHeader>

          <CardContent>
            <Badge>
              {formatStatus(currentStatus)}
            </Badge>
          </CardContent>
        </Card>
      )}

      {!loading &&
        !error &&
        history.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No status history yet.
            </CardContent>
          </Card>
        )}

      {!loading && !error && history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Status history</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">
                      {formatStatus(item.status)}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function formatStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}