import InfoFilters from "../../components/InfoFilters";
import { getExternalNews, getLocalPosts } from "../../lib/info";

export default async function InfoPage() {
  const localPosts = await getLocalPosts();
  const newsItems = await getExternalNews();
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Info</h1>
      <p className="text-lg text-slate-300 mb-8">Learning and News</p>
      <InfoFilters localPosts={localPosts} newsItems={newsItems} />
    </div>
  );
}
