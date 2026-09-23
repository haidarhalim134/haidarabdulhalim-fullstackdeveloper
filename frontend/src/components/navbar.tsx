import { Briefcase } from 'lucide-react'
import * as React from 'react'
import { LogoutButton } from './logout-button'
import { Link } from 'react-router-dom'

export default function Navbar() {
    return (
        <nav className="border-b border-b-foreground/10 p-3 h-16">
          <div className="w-full flex justify-between items-center px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link to={"/job-seeker/find-job"} className="flex flex-row items-center gap-2"><Briefcase /> GetJobs</Link>

              <Link to={"/job-seeker/find-job"} className="flex flex-row items-center gap-2">Find Job</Link>
              <Link to={"/company/jobs"} className="flex flex-row items-center gap-2">Company Job</Link>
              <Link to={"/company/jobs/new"} className="flex flex-row items-center gap-2">Create Job</Link>
            </div>
            <div className="flex flex-row space-x-2">
              <LogoutButton />
            </div>
          </div>
        </nav>
    )
}