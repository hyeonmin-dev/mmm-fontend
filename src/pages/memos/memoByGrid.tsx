import { myMemosQuery_myMemos_groups } from "../../__generated__/myMemosQuery";
import { Memo } from "../../components/memo/memo";
import { CMemoAddButton, MemoAddButton } from "../../components/memo/memo-add-button";
import styled from "styled-components";
import { EmptyGroup } from "../../components/memo/empty-group";
import { SelectedMemo } from "../../components/memo/selected-memo";
import { useRecoilValue } from "recoil";
import { selectMemoAtom } from "../../atom";

interface IMemoByGroupProps {
    groups?: myMemosQuery_myMemos_groups[] | undefined | null;
    createMemoGroup: any;
}

export const MemoByGrid: React.FC<IMemoByGroupProps> = ({ groups, createMemoGroup }) => {  
    const selectedMemo = useRecoilValue(selectMemoAtom);

    return (                  
        <div className="wrapper-memo-grid">
            { (groups) && 
                groups?.map((group) => (
                    group.memos?.map((memo, index) => (
                        <Memo key={index} memo={memo}/>
                    ))
                ))
            }

            { (groups && groups[0]) &&
                <MemoAddButton groupId={groups[0].id}/>
            }

            { groups?.length === 0 &&
                <EmptyGroup onClick={createMemoGroup} />
            }

            {selectedMemo.id !== 0 && <SelectedMemo />}
        </div>
    );
};