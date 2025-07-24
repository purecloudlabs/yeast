import { DocumentNode } from '../index';
export interface AnchorPathMapping {
    oldPath: string;
    newPath?: number;
    isOrphaned: boolean;
}
export declare function mapAnchorPath(anchorPath: string, oldNode: DocumentNode, newNode: DocumentNode): AnchorPathMapping;
export declare function diff(oldNode: DocumentNode | undefined, newNode: DocumentNode | undefined): DocumentNode | undefined;
//# sourceMappingURL=diff.d.ts.map