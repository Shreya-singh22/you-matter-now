"""Build the Chroma vector store from the PDFs in ./data.

Run this locally and commit the resulting chroma_db/ directory. Building
the index embeds every chunk and peaks around 700MB, which does not fit a
512MB instance - but answering a question only embeds that one question,
which peaks near 275MB. Shipping a prebuilt index is what makes retrieval
viable on a small box.

    python build_index.py

Re-run it whenever the PDFs in ./data change.
"""

import os
import shutil
import sys

import chromadb
from chromadb.utils import embedding_functions
from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
CHROMA_DIR = os.path.join(BASE_DIR, "chroma_db")

COLLECTION = "mental_health"
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50

# Embed in small batches - one big call is what pushes peak memory over
# 600MB. This keeps the build usable on a modest machine too.
BATCH_SIZE = 16


def main() -> int:
    if not os.path.isdir(DATA_DIR):
        print(f"No data directory at {DATA_DIR}")
        return 1

    print("Loading PDFs...")
    documents = DirectoryLoader(DATA_DIR, glob="*.pdf", loader_cls=PyPDFLoader).load()
    if not documents:
        print(f"No PDFs found in {DATA_DIR}")
        return 1
    print(f"  {len(documents)} pages")

    chunks = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP
    ).split_documents(documents)
    print(f"  {len(chunks)} chunks")

    if os.path.isdir(CHROMA_DIR):
        print("Removing existing index...")
        shutil.rmtree(CHROMA_DIR)

    # Chroma's bundled ONNX MiniLM - same model as sentence-transformers
    # all-MiniLM-L6-v2, but quantized and run through onnxruntime, so it
    # needs no torch. Query time must use this exact function or the
    # vectors won't be comparable.
    embedder = embedding_functions.ONNXMiniLM_L6_V2()

    client = chromadb.PersistentClient(path=CHROMA_DIR)
    collection = client.create_collection(name=COLLECTION, embedding_function=embedder)

    print(f"Embedding in batches of {BATCH_SIZE}...")
    for start in range(0, len(chunks), BATCH_SIZE):
        batch = chunks[start : start + BATCH_SIZE]
        collection.add(
            ids=[f"chunk-{start + i}" for i in range(len(batch))],
            documents=[c.page_content for c in batch],
            metadatas=[{"source": str(c.metadata.get("source", ""))} for c in batch],
        )
        print(f"  {min(start + BATCH_SIZE, len(chunks))}/{len(chunks)}")

    print(f"\nDone. {collection.count()} chunks in {CHROMA_DIR}")
    print("Commit the chroma_db/ directory so the deployed app can use it.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
