#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/0413983756297d2027d3fc0f80b73811ad8d5988e370eccdf899317c020e68fa/contract';
import startContract from '../../snapshots/0413983756297d2027d3fc0f80b73811ad8d5988e370eccdf899317c020e68fa/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/aa7514d4b1dd029e4a6ca66007164edc6b0c5c4a9dffadd38d2ad5dee340fadc/contract';
import endContract from '../../snapshots/aa7514d4b1dd029e4a6ca66007164edc6b0c5c4a9dffadd38d2ad5dee340fadc/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'application_histories',
        columns: [
          col('applicationId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'application_histories_status_check_f5f587a7',
            "\"status\" IN ('APPLIED', 'REVIEWING', 'SHORTLISTED', 'REJECTED', 'ACCEPTED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'applications',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('jobId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('jobSeekerProfileId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('APPLIED'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'applications_status_check_f5f587a7',
            "\"status\" IN ('APPLIED', 'REVIEWING', 'SHORTLISTED', 'REJECTED', 'ACCEPTED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'jobs',
        columns: [
          col('companyProfileId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('location', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('salaryMax', 'numeric', { codecRef: { codecId: 'pg/numeric@1' } }),
          col('salaryMin', 'numeric', { codecRef: { codecId: 'pg/numeric@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'jobs_type_check_f61b6a72',
            "\"type\" IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE', 'REMOTE')",
          ),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'applications',
        constraint: 'applications_jobId_jobSeekerProfileId_key',
        columns: ['jobId', 'jobSeekerProfileId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'application_histories',
        index: 'application_histories_applicationId_idx_8158f91a',
        columns: ['applicationId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'applications',
        index: 'applications_jobId_idx_623c8f77',
        columns: ['jobId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'applications',
        index: 'applications_jobSeekerProfileId_idx_b539dd93',
        columns: ['jobSeekerProfileId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'jobs',
        index: 'jobs_companyProfileId_idx_ae57a554',
        columns: ['companyProfileId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'application_histories',
        foreignKey: {
          name: 'application_histories_applicationId_fkey',
          columns: ['applicationId'],
          references: { schema: 'public', table: 'applications', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'applications',
        foreignKey: {
          name: 'applications_jobId_fkey',
          columns: ['jobId'],
          references: { schema: 'public', table: 'jobs', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'applications',
        foreignKey: {
          name: 'applications_jobSeekerProfileId_fkey',
          columns: ['jobSeekerProfileId'],
          references: { schema: 'public', table: 'job_seeker_profiles', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'jobs',
        foreignKey: {
          name: 'jobs_companyProfileId_fkey',
          columns: ['companyProfileId'],
          references: { schema: 'public', table: 'company_profiles', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
