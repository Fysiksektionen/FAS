
import { basicDict, stdDict } from '../../../shared/types/common';

export default class Graph {

    private nodes: {[id: string]: Node} = {};
    private edges: {[id: string]: Edge} = {};

    constructor(
        private readonly directed = true,
    ) {}

    public clear() {
        this.nodes = {};
        this.edges = {};
    }

    public addNode(id: string, attrs?: basicDict) {
        return this.nodes[id] = attrs;
    }

    public addEdge(node1Id: string, node2Id: string, id = `${node1Id} - ${node2Id}`) {
        const node1 = this.nodes[node1Id];
        const node2 = this.nodes[node2Id];
        if (!node1 || !node2) return null;
        return this.edges[id] = {id, node1, node2};
    }

}

type Node = basicDict

type Edge = basicDict & {
    id: string;
    node1: Node;
    node2: Node;
}