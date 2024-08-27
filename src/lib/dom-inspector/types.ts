export type DomNodeData =
  | ElementData
  | TextData
  | CDataData
  | CommentData
  | ProcessingInstructionData
  | DocumentTypeData
  | DocumentData
  | DocumentFragmentData;

export interface ParentData {
  childNodes?: DomNodeData[];
}

export type ElementData = {
  tagName: string;
  nodeType: 1;
  nodeName: string;
  attributes?: Array<AttributeData>;
  childNodes?: Array<DomNodeData>;
};

export type AttributeData = {
  name: string;
  value: string;
};

export type TextData = {
  nodeType: 3;
  nodeName: '#text';
  textContent: string;
};

export type CDataData = {
  nodeType: 4;
  nodeName: '#cdata-section';
  textContent: string;
};

export type CommentData = {
  nodeType: 8;
  nodeName: '#comment';
  textContent: string;
};

export type ProcessingInstructionData = {
  nodeType: 7;
  nodeName: '#processing-instruction';
  name: string;
};

export type DocumentData = {
  nodeType: 9;
  nodeName: '#document';
  childNodes: DomNodeData[];
};

export type DocumentTypeData = {
  nodeType: 10;
  nodeName: '#document-type';
  name: string;
  publicId?: string;
  systemId?: string;
};

export type DocumentFragmentData = {
  nodeType: 11;
  nodeName: '#document-fragment';
  childNodes: DomNodeData[];
};
