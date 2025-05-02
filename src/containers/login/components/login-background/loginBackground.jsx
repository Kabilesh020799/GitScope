import { useEffect, useState } from "react";
import React from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { PARTICLES_OPTIONS } from "./constants";

const LoginBackground = () => {
  const [isParticlesLoaded, setIsParticlesLoaded] = useState(false);

  useEffect(() => {
    const initParticles = async () => {
      initParticlesEngine(async (engine) => {
        await loadSlim(engine);
      }).then(() => {
        setIsParticlesLoaded(true);
      });
    };

    initParticles();
  }, []);

  return (
    isParticlesLoaded && (
      <Particles id="tsparticles" options={PARTICLES_OPTIONS} />
    )
  );
};

export default React.memo(LoginBackground);
