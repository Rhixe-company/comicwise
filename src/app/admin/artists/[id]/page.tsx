import EditArtistForm from "src/app/admin/artists/[id]/EditArtistForm";

export default function Page({ params }: { params: { id: string } }) {
  // Server component: delegate to the server-rendered form (contains a small client uploader)
  return <EditArtistForm params={params} />;
}
