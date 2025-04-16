declare module "framer-motion" {
    import { MotionProps } from "framer-motion";
    export const motion: { [key: string]: React.ComponentType<MotionProps> };
  }
  