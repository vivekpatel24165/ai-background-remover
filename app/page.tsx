"use client";

import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
  }, []);

  async function removeBackground() {
    if (!file) {
      alert("Please select an image");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/remove-bg", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      setResultUrl(url);
    } catch (error) {
      alert("Background removal failed");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <motion.div
        className="absolute top-0 left-0 w-[600px] h-[600px] bg-yellow-500/20 blur-[150px] rounded-full"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-400/10 blur-[150px] rounded-full"
        animate={{
          x: [0, -40, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    <motion.div
  initial={{ opacity: 0, y: 50, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{
    duration: 1,
    ease: "easeOut",
  }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-4xl rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl shadow-[0_0_100px_rgba(250,204,21,0.15),0_0_200px_rgba(250,204,21,0.05)] p-10 relative overflow-hidden"
      >
        {/* Card Inner Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent rounded-3xl pointer-events-none" />

        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-6xl font-extrabold text-center"
          >
            <span className="text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.8)] animate-pulse">
              Background
            </span>{" "}
            <span className="bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
              Remover
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center text-gray-400 mt-4 text-lg"
          >
            Premium AI Background Removal Tool
          </motion.p>

          <AnimatePresence mode="wait">
            {!user ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-center mt-10"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => signInWithPopup(auth, provider)}
                  className="relative group bg-yellow-400 text-black px-8 py-4 rounded-2xl font-bold shadow-[0_0_40px_rgba(250,204,21,0.5)]"
                >
                  <motion.div
                    className="absolute inset-0 bg-yellow-300 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                  <span className="relative z-10">Login with Google</span>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mt-8"
                >
                  <h2 className="text-xl text-gray-300">
                    Welcome{" "}
                    <span className="text-yellow-400 font-semibold">
                      {user.displayName}
                    </span>
                  </h2>
                </motion.div>

                <motion.label
                  className={`block mt-8 cursor-pointer`}
                  onDragEnter={() => setIsDragging(true)}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={() => setIsDragging(false)}
                >
                  <motion.div
                    whileHover={{ scale: 1.02, borderColor: "rgba(250, 204, 21, 0.6)" }}
                    className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
                      isDragging
                        ? "border-yellow-400 bg-yellow-400/10"
                        : "border-yellow-500/40 hover:border-yellow-400/60"
                    }`}
                  >
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <p className="text-xl font-semibold text-yellow-400">
                        {isDragging ? "Drop It Here!" : "Upload Image"}
                      </p>
                    </motion.div>

                    <p className="text-gray-400 mt-2">JPG, PNG supported</p>

                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) =>
                        setFile(e.target.files ? e.target.files[0] : null)
                      }
                    />
                  </motion.div>
                </motion.label>

                {file && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-yellow-300"
                  >
                    {file.name}
                  </motion.p>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={removeBackground}
                  disabled={loading}
                  className="relative w-full mt-8 bg-yellow-400 text-black font-bold py-4 rounded-2xl transition-all duration-300 shadow-[0_0_40px_rgba(250,204,21,0.5)] overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 bg-[length:200%_100%]"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <span className="relative z-10">
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="inline-block w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                        />
                        Removing Background...
                      </span>
                    ) : (
                      "Remove Background"
                    )}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {resultUrl && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 50 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 50 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="mt-10 text-center"
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <img
                          src={resultUrl}
                          alt="Result"
                          className="mx-auto rounded-2xl shadow-[0_0_60px_rgba(250,204,21,0.3)] max-h-[500px] ring-1 ring-yellow-500/20"
                        />

                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          href={resultUrl}
                          download="background-removed.png"
                          className="relative inline-block mt-6 bg-yellow-400 text-black px-8 py-3 rounded-xl font-bold shadow-[0_0_30px_rgba(250,204,21,0.5)] overflow-hidden group"
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 bg-[length:200%_100%]"
                            animate={{
                              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                          <span className="relative z-10">Download PNG</span>
                        </motion.a>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </main>
  );
}