import { Suspense } from "react";
import PerformerContent from "./PerformerContent";

export default function PerformerPage() {
  return (
    <div>
      <h1>演出者出演信息</h1>
      <Suspense fallback={<p>正在加载...</p>}>
        <PerformerContent />
      </Suspense>
    </div>
  );
}
