import type { NextConfig } from "next";

// Cache Components (cacheComponents: true) reste désactivé volontairement :
// ce projet est un panneau d'administration et des pages publiques qui doivent
// toujours refléter des données fraîches (scans, destination Google modifiable).
// Voir CLAUDE.md avant de l'activer.
const nextConfig: NextConfig = {};

export default nextConfig;
