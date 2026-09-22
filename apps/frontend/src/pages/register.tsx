import * as React from 'react'
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Role } from '../types/auth.dto';
import { api } from '../lib/api';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState<Role>("JOB_SEEKER");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Job seeker
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");

  // Company
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const body =
      role === "JOB_SEEKER"
        ? {
            email,
            password,
            role,
            jobSeekerProfile: {
              fullName,
              phone,
              resumeUrl: resumeUrl || null,
            },
          }
        : {
            email,
            password,
            role,
            companyProfile: {
              companyName,
              website: website || null,
            },
          };

    try {
      await api("/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      });

      navigate("/login");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Join the platform as a job seeker or company
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role */}
            <div className="space-y-2">
              <Label>Account type</Label>

              <Select
                value={role}
                onValueChange={(value) => setRole(value as Role)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="JOB_SEEKER">
                    Job Seeker
                  </SelectItem>

                  <SelectItem value="COMPANY">
                    Company
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {role === "JOB_SEEKER" ? (
              <div className="space-y-4 rounded-lg border p-4">
                <h3 className="font-medium">
                  Job seeker information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+62 812..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resumeUrl">
                    Resume URL
                  </Label>
                  <Input
                    id="resumeUrl"
                    type="url"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 rounded-lg border p-4">
                <h3 className="font-medium">
                  Company information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="companyName">
                    Company name
                  </Label>

                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) =>
                      setCompanyName(e.target.value)
                    }
                    placeholder="Acme Inc."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>

                  <Input
                    id="website"
                    type="url"
                    value={website}
                    onChange={(e) =>
                      setWebsite(e.target.value)
                    }
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}