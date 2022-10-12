export namespace CommentsResults{

    export interface PageInfo {
        totalResults: number;
        resultsPerPage: number;
    }

    export interface AuthorChannelId {
        value: string;
    }

    export interface Snippet2 {
        channelId: string;
        videoId: string;
        textDisplay: string;
        textOriginal: string;
        authorDisplayName: string;
        authorProfileImageUrl: string;
        authorChannelUrl: string;
        authorChannelId: AuthorChannelId;
        canRate: boolean;
        viewerRating: string;
        likeCount: number;
        publishedAt: Date;
        updatedAt: Date;
    }

    export interface TopLevelComment {
        kind: string;
        etag: string;
        id: string;
        snippet: Snippet2;
    }

    export interface Snippet {
        channelId: string;
        videoId: string;
        topLevelComment: TopLevelComment;
        canReply: boolean;
        totalReplyCount: number;
        isPublic: boolean;
    }

    export interface AuthorChannelId2 {
        value: string;
    }

    export interface Snippet3 {
        channelId: string;
        videoId: string;
        textDisplay: string;
        textOriginal: string;
        parentId: string;
        authorDisplayName: string;
        authorProfileImageUrl: string;
        authorChannelUrl: string;
        authorChannelId: AuthorChannelId2;
        canRate: boolean;
        viewerRating: string;
        likeCount: number;
        publishedAt: Date;
        updatedAt: Date;
    }

    export interface Comment {
        kind: string;
        etag: string;
        id: string;
        snippet: Snippet3;
    }

    export interface Replies {
        comments: Comment[];
    }

    export interface Item {
        kind: string;
        etag: string;
        id: string;
        snippet: Snippet;
        replies: Replies;
    }

    export interface RootObject {
        kind: string;
        etag: string;
        nextPageToken: string;
        pageInfo: PageInfo;
        items: Item[];
    }

}

