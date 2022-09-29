import { gql, useMutation } from "@apollo/client";
import styled from "styled-components";
import { client } from "../../apollo";
import { CREATEMEMO_MUTATION } from "../../mutations";
import { createMemoMutation, createMemoMutationVariables } from "../../__generated__/createMemoMutation";
// @ts-ignore
import addImg from "../../images/add.png";

interface IMemoAddButtonProps {
    groupId: number;
}

export const CMemoAddButton = styled.div`
    display: flex;
    justify-aligns: center;
    align-items: center;
    height: 30px;
    border: 1px dashed #ddd;
    border-radius: 5px;
    margin-bottom: 5px;
    cursor: pointer;
    background-color: rgba(247, 247, 247 , 1);
    background-image: url(${addImg});
    background-size: 12px;
    background-position: center;
    background-repeat: no-repeat;
    transition: all 0.1s ease;

    &:hover {
        background-color: rgba(240, 240, 240 , 1);
    }
`;

export const MemoAddButton: React.FC<IMemoAddButtonProps> = ({ groupId }) => {
    const content = "new memo";

    const onCompleted = (data: createMemoMutation) => {
        const currentMemos = client.readFragment({
            id: `MemoGroup:${groupId}`,
            fragment: gql`
                fragment VerifiedMemoGroup on MemoGroup {
                    memos {
                        __typename
                        id
                        content
                    }
                }
            `,
        });
        client.writeFragment({
            id: `MemoGroup:${groupId}`,
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
                memos: [
                    {__typename: "Memo", id: data.createMemo.id, content},
                    ...currentMemos.memos                    
                ],
            },
        });
    };
    const [createMemoMutation] = useMutation<createMemoMutation, createMemoMutationVariables>(CREATEMEMO_MUTATION, {
        onCompleted
    });
    const createMemo = () => {
        createMemoMutation({
            variables: {
                createMemoInput: {
                    content,
                    groupId
                }
            }
        });
    }
    
    return (
        <CMemoAddButton onClick={createMemo}></CMemoAddButton>
    );
}