import React from "react";
import Hero from "../components/Hero";
import Introduction from "../components/Introduction";
import Solutions from "../components/Solutions";
import Showcase from "../components/Showcase";
import Experience from "../components/Experience";

export default function Home({ t, setPage }) {
  return (
    <>
      <Hero t={t} setPage={setPage} />
      <Introduction t={t} setPage={setPage} />
      <Solutions t={t} setPage={setPage} />
      <Showcase t={t} setPage={setPage} />
      <Experience t={t} setPage={setPage} />
    </>
  );
}
