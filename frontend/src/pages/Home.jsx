import Hero from "../components/Hero";
import About from "../components/About";
import ExperienceTimeline from "../components/ExperienceTimeline";
import EducationTimeline from "../components/EducationTimeline";
import ServicesGrid from "../components/ServicesGrid";
import TestimonialSlider from "../components/TestimonialSlider";
import BlogPreview from "../components/BlogPreview";
import ContactForm from "../components/ContactForm";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <ExperienceTimeline />
      <EducationTimeline />
      <ServicesGrid />
      <TestimonialSlider />
      <BlogPreview />
      <ContactForm />
    </>
  );
}
