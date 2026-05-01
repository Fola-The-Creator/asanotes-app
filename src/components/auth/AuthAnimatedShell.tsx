"use client";

import { motion } from "motion/react";
import Logo from "@/components/icons/Logo";

export function AuthAnimatedShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-grey-0">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-grey-50 flex-col justify-between p-12">
        <div>
          <Logo className="w-32 fill-grey-900" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md"
        >
          <h1 className="text-4xl font-bold text-grey-900 mb-4 text-balance capitalize">
            Your thoughts, organized beautifully.
          </h1>
          <p className="text-lg text-grey-600 leading-relaxed">
            A modern note-taking app designed for productivity, knowledge
            management, and seamless AI integration.
          </p>
        </motion.div>

        <div className="flex items-center gap-8">
          <div>
            <p className="text-3xl font-bold text-grey-900">10K+</p>
            <p className="text-sm text-grey-500">Active Users</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-grey-900">1M+</p>
            <p className="text-sm text-grey-500">Notes Created</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-grey-900">99.9%</p>
            <p className="text-sm text-grey-500">Uptime</p>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        {/* Logo (For Mobile View) */}
        <div className="absolute bottom-12">
          <Logo className="lg:hidden w-28 fill-grey-900" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
