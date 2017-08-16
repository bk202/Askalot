
export enum StoryActionTypes {

    StoryPreviewsRequest = <any> "StoryPreviewsError",
    StoryPreviewsError = <any> "StoryPreviewsError",
    StoryPreviewsOK = <any> "StoryPreviewsOK",

    CreateStoryRequest = <any> "CreateStoryRequest",
    CreateStoryError = <any> "CreateStoryError",
    StoryCreated = <any> "StoryCreated",

    FetchStoryPageRequest = <any> "FetchStoryPageRequest",
    FetchStoryPageOK = <any> "FetchStoryPageOK",
    FetchStoryPageError = <any> "FetchStoryPageError",

    EditStoryRequest = <any> "EditStoryRequest",
    EditStoryOK = <any> "EditStoryOK",
    EditStoryError = <any> "EditStoryError",

    ChangePostPage = <any> "ChangePostPage",

    CreateStoryComment = <any> "CreateStoryComment",
    CreateStoryCommentError = <any> "CreateStoryCommentError",

    UpdateStoryComment = <any> "UpdateStoryComment",
    UpdateStoryCommentError = <any> "UpdateStoryCommentError",

    DeleteComment = <any> "DeleteComment",
    DeleteCommentError = <any> "DeleteCommentError",

    UpVoteStory = <any> "UpVoteStory",
    DownVoteStory = <any> "DownVoteStory",

    StoryPageError = <any> "StoryPageError",

    StoryEditorStateChange = <any> "StoryEditorStateChange"
}