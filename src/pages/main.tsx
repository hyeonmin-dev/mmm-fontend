import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { editMemoMutation, editMemoMutationVariables } from "../__generated__/editMemoMutation";
import { rangeMemoMutation, rangeMemoMutationVariables } from "../__generated__/rangeMemoMutation";
import { myMemosQuery, myMemosQuery_myMemos } from "../__generated__/myMemosQuery";

const MYMEMOS_QUERY = gql`
    query myMemosQuery {
        myMemos {
            ok
            error
            groups {
                id
                title
                memos {
                    id
                    content
                }
            }
        }
    }
`;

const EDITMEMO_MUTATION = gql`
    mutation editMemoMutation ($editMemoInput: EditMemoInput!) {
        editMemo (input: $editMemoInput) {
            ok
            error
        }
    }
`;

const RANGEMEMO_MUTATION = gql`
    mutation rangeMemoMutation ($rangeMemoInput: RangeMemoInput!) {
        rangeMemo (input: $rangeMemoInput) {
            ok
            error
        }
    }
`;

export interface IRangeMemoMutationInput {
    id: number;
    content: string;
    orderby: number;
    groupId?: number;
}

const MemoGroup = styled.div`
    max-width: 20%;
    width: 25%;    

    &:nth-child(n+2) {
        margin-left: 20px;
    }
`;

const GroupTitle = styled.div`
    padding-bottom: 10px;
    font-size: 18px;
    font-weight: 500;
`;

const Memo = styled.div`
    border: 1px solid #ededed;
    border-radius: 5px;
    width: 100%;
    min-height: 120px;
    padding: 10px;

    &:nth-child(n+2) {
        margin-top: 10px;
    }
`;

export const Main = () => {
    const client = useApolloClient();
    const onCompleted = ({ editMemo: { ok } }: editMemoMutation) => {
        
    };
    const onRangeCompleted = ( data: rangeMemoMutation) => {
        refetch();
    };

    const { data: myMemoData, loading, refetch } = useQuery<myMemosQuery, myMemosQuery_myMemos>(MYMEMOS_QUERY);
    const [editMemoMutation, { data: editMemoMutationResult, loading: editMemoLoadaing }] = useMutation<editMemoMutation, editMemoMutationVariables>(EDITMEMO_MUTATION, {
        onCompleted
    });
    const [rangeMemoMutation, { }] = useMutation<rangeMemoMutation, rangeMemoMutationVariables>(RANGEMEMO_MUTATION, {
        onCompleted: onRangeCompleted
    });
      
    const onDragEnd = (result: DropResult) => {
        console.log(result);

        const groups = myMemoData?.myMemos.groups;
        const { source, destination } = result;

        if (!groups || !destination) { return; }

        if (source.droppableId === destination.droppableId) {
            // same group
            const group = groups.find((group) => group.id === Number(destination.droppableId));
            const memos = group?.memos;
            if (!memos) { return; }

            const tempMemos = memos.filter((memo, index) => index != source.index);
            const sourceMemo = memos[source.index];
            
            const newMemos = [
                ...tempMemos.slice(0, destination.index),
                sourceMemo,
                ...tempMemos.slice(destination.index)
            ];

            client.writeFragment({
                id: `MemoGroup:${destination.droppableId}`,
                fragment: gql`
                    fragment VerifiedMemoGroup on MemoGroup {
                        memos {
                            __typename
                            id
                            content
                        }
                    }
                `,
                data: {
                    memos: newMemos,
                },
            });
        } else {
            // diff group
            let sourceMemos = groups.find((group) => group.id === Number(source.droppableId))?.memos;
            let destinationMemos = groups.find((group) => group.id === Number(destination.droppableId))?.memos;
            if (!sourceMemos || !destinationMemos) { return; }

            const sourceMemo = sourceMemos[source.index];
            sourceMemos = sourceMemos.filter((_, index) => index !== source.index);
            destinationMemos = [
                ...destinationMemos.slice(0, destination.index),
                sourceMemo,
                ...destinationMemos.slice(destination.index)
            ];

            
            client.writeFragment({
                id: `MemoGroup:${source.droppableId}`,
                fragment: gql`
                    fragment VerifiedMemoGroup on MemoGroup {
                        memos {
                            __typename
                            id
                            content
                        }
                    }
                `,
                data: {
                    memos: sourceMemos,
                },
            });

            client.writeFragment({
                id: `MemoGroup:${destination.droppableId}`,
                fragment: gql`
                    fragment VerifiedMemoGroup on MemoGroup {
                        memos {
                            __typename
                            id
                            content
                        }
                    }
                `,
                data: {
                    memos: destinationMemos,
                },
            });
        }

        //if (de)
        /*
        
        if (!groups) return;
        
        
        const sourceMemos = groups.find((group, index) => index === Number(source.droppableId))?.memos;

        if (!sourceMemos) return;
        const sourceMemo = sourceMemos[source.index];

        if (destination?.droppableId === source.droppableId) {
            // same group
            if (source.index === destination.index) { return; }

            const tempMemos = sourceMemos.filter((memo, index) => index !== source.index);
            const newMemos = [
                ...tempMemos.slice(0, destination.index),
                sourceMemo,
                ...tempMemos.slice(destination.index)
            ];
            
            
            const req:number[] = [];
            newMemos.map((memo) => {
                req.push(memo.id);
            });
            
              
            rangeMemoMutation({
                variables: {
                    rangeMemoInput: {
                        memoIds: req
                    }
                }
            });
        } else {
            // move group
            const destinationMemos = groups.find((group) => group.id === Number(destination?.droppableId))?.memos;
            const destinationGroupId = Number(destination?.droppableId);
            if (!destinationMemos) { return; }
            if (!destination) { return; }

            const newMemos = [
                ...destinationMemos.slice(0, destination?.index),
                {...sourceMemo},
                ...destinationMemos.slice(destination?.index )
            ];
            
            const req:number[] = [];
            newMemos.map((memo) => {
                req.push(memo.id);
            });
            
            editMemoMutation({
                variables: {
                    editMemoInput: {
                        id: sourceMemo.id,
                        groupId: destinationGroupId
                    }
                }
            });

            rangeMemoMutation({
                variables: {
                    rangeMemoInput: {
                        memoIds: req
                    }
                }
            });
        }
        */
    };

    return (                  
        <div className="wrapper-memo">
            <DragDropContext onDragEnd={onDragEnd}>
            {
                !loading && 
                <div className="memo-board">
                    {
                        myMemoData?.myMemos.groups?.map((group, index) => (                            
                            <MemoGroup key={group.id}>                                
                                <GroupTitle>{group.title}</GroupTitle>
                                
                                <Droppable droppableId={"" + group.id} key={index}>
                                    {(droppableProvided) => (
                                        <div ref={droppableProvided.innerRef}>
                                            {
                                                group.memos?.map((memo, index1) => (
                                                    <Draggable draggableId={"memo" + memo.id} index={index1} key={index1}>
                                                        {(provided, snapshot) =>
                                                            <div
                                                                ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                          >
                                                            <Memo key={memo.id} ref={provided.innerRef}>
                                                                    {memo.content}
                                                                    {droppableProvided.placeholder}
                                                                </Memo>
                                                            </div>
                                                        }
                                                    </Draggable>
                                                ))
                                            }
                                        </div>
                                    )}                                
                                </Droppable>
                           </MemoGroup>
                        ))
                    }
                </div>
            }
            </DragDropContext>
        </div>
    );
};