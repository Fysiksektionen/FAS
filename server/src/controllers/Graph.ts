
import { basicDict, stdDict } from '../../../shared/types/common';

export default class Graph {

    private nodes: {[id: string]: Node} = {};
    private edges: {[id: string]: Edge} = {};

    constructor(
        private readonly directed = true,
        public graphAttrs?: basicDict,
        public nodeAttrs?: basicDict,
        public edgeAttrs?: basicDict
    ) {}

    public addNode(id: string, value?: any, attrs?: basicDict) {
        attrs = {...this.nodeAttrs, ...attrs};
        return this.nodes[id] = new Node(id, value, attrs);
    }

    public addEdge(node1Id: string, node2Id: string, id = `${node1Id} - ${node2Id}`, attrs?: basicDict) {
        attrs = {...this.edgeAttrs, ...attrs};
        const node1 = this.nodes[node1Id];
        const node2 = this.nodes[node2Id];
        if (!node1 || ! node2) return null;
        return this.edges[id] = new Edge(id, node1, node2, attrs);
    }

}

class Node {

    constructor(
        public readonly id: string,
        public value: any,
        public attrs?: basicDict
    ) {}

}

class Edge {

    constructor(
        public readonly id: string,
        public node1: Node,
        public node2: Node,
        public attrs?: basicDict
    ) {}

}