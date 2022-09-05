import { Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { myMemosQuery_myMemos_groups } from "../../__generated__/myMemosQuery";
import { GroupTitle } from "./group-title";
import { Memo } from "./memo";
import { MemoAddButton } from "./memo-add-button";

interface IMemoGroupProps {
    group: myMemosQuery_myMemos_groups;
}

const CMemoGroup = styled.div`
    max-width: 20%;
    width: 25%;    
    background-color: rgb(234, 235, 239);
    border-radius: 7px;
    padding: 0 20px 20px 20px;

    &:nth-child(n+2) {
        margin-left: 20px;
    }

    > * {
        margin-top: 3px;
    }

    * {
        outline: none;
    }
`;

export const MemoGroup: React.FC<IMemoGroupProps> = ({ group }) => {
    return (
        <CMemoGroup key={group.id}>
            <GroupTitle
                groupId={group.id}
                title={group.title}            
            />
            <MemoAddButton
                groupId={group.id}
            />
            <Droppable droppableId={"" + group.id}>
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >                             
                        {group.memos?.map( (memo, index1) => (
                            <Draggable key={memo.id} draggableId={"memo" + memo.id} index={index1}>
                                {(provided) => (
                                    <Memo
                                        provided={provided}
                                        id={memo.id}
                                        content={memo.content}
                                    >
                                    </Memo>
                                )}                                                    
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}                                
            </Droppable>
        </CMemoGroup>
    )
}