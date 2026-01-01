export const NOTES_DATA = [
  {
    "filename": "01-gnn-intro.md",
    "title": "Introduction to Graph Neural Networks",
    "date": "2025-02-10T09:00:00.000Z",
    "content": "\n# Introduction to GNNs\n\nGraph Neural Networks (GNNs) are a class of deep learning methods designed to perform inference on data described by graphs. GNNs are neural networks that can be directly applied to graphs, providing an easy way to do node-level, edge-level, and graph-level prediction tasks.\n\nFundamental concepts:\n- Nodes (Vertices)\n- Edges (Links)\n- Adjacency Matrix\n- Node Embeddings\n",
    "contentLength": 396
  },
  {
    "filename": "02-message-passing.md",
    "title": "Message Passing Layers",
    "date": "2025-03-22T14:30:00.000Z",
    "content": "\n# Message Passing\n\nMessage passing is the core operation in GNNs. For each node, we aggregate features from its neighbors to update its own feature vector.\n\nSteps:\n1. Message generation\n2. Aggregation (Sum, Mean, Max)\n3. Update function (MLP, GRU)\n\nThis allows nodes to capture local neighborhood information.\n",
    "contentLength": 311
  },
  {
    "filename": "03-evaluation.md",
    "title": "Evaluation of Graph Models",
    "date": "2025-05-15T11:00:00.000Z",
    "content": "\n# Evaluation Metrics\n\nWhen evaluating graph models, we often look at:\n- Accuracy / F1-score for node classification\n- ROC-AUC for link prediction\n- Mean Squared Error for regression tasks\n\nIt is important to use proper train/test splits that respect the graph structure (e.g., node-based or edge-based splits).\nThe size of the graph also impacts performance.\nIf the graph is very large, consider sampling methods like GraphSAGE.\nAdditionally, consider the sparsity of the adjacency matrix. \nLarge graphs require efficient memory management.\nWait, let me add more text here to see the \"relative change in size\" effect.\nMore text... more text... more text...\nTesting the vertical height change based on content length.\nThe user wants the bars to be the same size or relatively larger if there is more text.\nSo this note should probably result in a taller \"bar\" or a different visual weight.\n",
    "contentLength": 890
  }
];