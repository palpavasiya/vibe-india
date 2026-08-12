import RadioExperience from "@/components/radio/RadioExperience";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <RadioExperience />
    </Suspense>
  );
}
