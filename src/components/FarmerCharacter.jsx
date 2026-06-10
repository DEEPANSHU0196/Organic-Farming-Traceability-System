import React from 'react';
import { motion } from 'motion/react';
import farmerImg from '../assets/farmer_transparent.png';

const FarmerCharacter = () => {
  return (
    <motion.div
      className="absolute bottom-0 right-0 lg:right-[5%] z-[5] pointer-events-none select-none"
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
    >
      <div className="relative w-[300px] md:w-[400px] lg:w-[500px] xl:w-[550px] h-auto">
        {/* Completely static farmer image */}
        <img
          src={farmerImg}
          alt="Farmer character"
          className="w-full h-auto block"
          draggable={false}
        />

        {/* Shadow under the farmer */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[20px] md:h-[30px] rounded-[50%] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.08) 50%, transparent 70%)',
          }}
        />
      </div>
    </motion.div>
  );
};

export default FarmerCharacter;
