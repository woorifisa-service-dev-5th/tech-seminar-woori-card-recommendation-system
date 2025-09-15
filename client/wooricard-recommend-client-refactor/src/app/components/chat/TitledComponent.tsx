import type { SpringOptions } from 'motion';
import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface TiltedContainerProps {
    children: React.ReactNode;
    scaleOnHover?: number;
    rotateAmplitude?: number;
}

const springValues: SpringOptions = {
    damping: 30,
    stiffness: 100,
    mass: 1,
};


export default function TiltedContainer({
    children,
    scaleOnHover = 1.02,
    rotateAmplitude = 4, 
}: TiltedContainerProps) {
    const ref = useRef<HTMLDivElement>(null);

    const rotateX = useSpring(useMotionValue(0), springValues);
    const rotateY = useSpring(useMotionValue(0), springValues);
    const scale = useSpring(1, springValues);

    function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;

        const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
        const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

        rotateX.set(rotationX);
        rotateY.set(rotationY);
    }

    function handleMouseEnter() {
        scale.set(scaleOnHover);
    }

    function handleMouseLeave() {
        scale.set(1);
        rotateX.set(0);
        rotateY.set(0);
    }

    return (
        <motion.div
            ref={ref}
            className='relative [perspective:1200px]'
            onMouseMove={handleMouse}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                className='[transform-style:preserve-3d] w-full h-full'
                style={{
                    rotateX,
                    rotateY,
                    scale,
                }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
}
