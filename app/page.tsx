import React from "react";
import client from "@/tina/__generated__/client";
import ClientPortfolio from "@/components/ClientPortfolio";

export const revalidate = 300;

export default async function Home() {
  const educationRes = await client.queries.educationConnection();
  const experienceRes = await client.queries.experienceConnection();
  const projectsRes = await client.queries.projectConnection();
  // Using dynamic query or fallback if tina types aren't fully generated yet
  let publicationsRes, certificationsRes, activitiesRes;
  try {
    publicationsRes = await (client.queries as any).publicationConnection();
    certificationsRes = await (client.queries as any).certificationConnection();
    activitiesRes = await (client.queries as any).activityConnection();
  } catch (e) {
    console.log("Types not yet ready for extra collections", e);
  }

  const education = educationRes?.data?.educationConnection?.edges?.map((e: any) => e?.node) || [];
  const experience = experienceRes?.data?.experienceConnection?.edges?.map((e: any) => e?.node) || [];
  const projects = projectsRes?.data?.projectConnection?.edges?.map((e: any) => e?.node) || [];
  const publications = publicationsRes?.data?.publicationConnection?.edges?.map((e: any) => e?.node) || [];
  const certifications = certificationsRes?.data?.certificationConnection?.edges?.map((e: any) => e?.node) || [];
  const activities = activitiesRes?.data?.activityConnection?.edges?.map((e: any) => e?.node) || [];

  return (
    <main className="w-full">
      <ClientPortfolio
        education={education}
        experience={experience}
        projects={projects}
        publications={publications}
        certifications={certifications}
        activities={activities}
      />
    </main>
  );
}
