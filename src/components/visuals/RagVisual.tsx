/** The demo GIF from the AwesomeRAG README: upload, local indexing and grounded chat. */
export default function RagVisual() {
  return (
    <figure>
      <div className="overflow-hidden rounded-xl border border-line bg-black">
        <img
          src="/projects/awesomerag-demo.gif"
          width={960}
          height={540}
          alt="AwesomeRAG demo: three documents are uploaded and indexed locally, then a chat question is answered with citations to the source documents."
          loading="lazy"
          draggable={false}
          className="block h-auto w-full"
        />
      </div>
      <figcaption className="mt-2 text-[12.5px] leading-snug text-muted">
        Real run: three synthetic documents uploaded, extracted and indexed locally, then compared in one grounded answer.
      </figcaption>
    </figure>
  );
}
