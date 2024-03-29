export namespace ChannelSearchResults {
    export interface PageInfo {
        totalResults: number;
        resultsPerPage: number;
    }

    export interface Default {
        url: string;
        width: number;
        height: number;
    }

    export interface Medium {
        url: string;
        width: number;
        height: number;
    }

    export interface High {
        url: string;
        width: number;
        height: number;
    }

    export interface Thumbnails {
        default: Default;
        medium: Medium;
        high: High;
    }

    export interface Localized {
        title: string;
        description: string;
    }

    export interface Snippet {
        title: string;
        description: string;
        customUrl: string;
        publishedAt: Date;
        thumbnails: Thumbnails;
        localized: Localized;
    }

    export interface RelatedPlaylists {
        likes: string;
        uploads: string;
    }

    export interface ContentDetails {
        relatedPlaylists: RelatedPlaylists;
    }

    export interface Statistics {
        viewCount: string;
        subscriberCount: string;
        hiddenSubscriberCount: boolean;
        videoCount: string;
    }

    export interface Item {
        kind: string;
        etag: string;
        id: string;
        snippet: Snippet;
        contentDetails: ContentDetails;
        statistics: Statistics;
    }

    export interface RootObject {
        kind: string;
        etag: string;
        pageInfo: PageInfo;
        items: Item[];
    }
}