import type { Statistiques } from "@/lib/statistiques";

export function StatsPanel({ stats }: { stats: Statistiques }) {
  return (
    <dl className="flex flex-wrap gap-8">
      <div>
        <dt className="font-mono text-xs uppercase tracking-wide text-encre/50">
          Scans
        </dt>
        <dd className="mt-1 text-2xl text-nuit">{stats.totalScans}</dd>
      </div>
      <div>
        <dt className="font-mono text-xs uppercase tracking-wide text-encre/50">
          Clics vers Google
        </dt>
        <dd className="mt-1 text-2xl text-nuit">{stats.totalClics}</dd>
      </div>
      <div>
        <dt className="font-mono text-xs uppercase tracking-wide text-encre/50">
          Taux de clic
        </dt>
        <dd className="mt-1 text-2xl text-nuit">
          {stats.tauxClic === null ? "—" : `${stats.tauxClic} %`}
        </dd>
      </div>
    </dl>
  );
}
