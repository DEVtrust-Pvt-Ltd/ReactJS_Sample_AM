import { useQueryContext } from "@/context/query/queryContext";
import ProfileCard from "@/layouts/userprofile/ProfileCard";
import { UPDATE_DEAL } from "@/lib/graphql/mutation/updateDeal";
import { mqMax } from "@/styles/base";
import { useRouter } from "next/navigation";
import {
  typographySubtitle1,
  typographySubtitle2Normal,
} from "@/styles/typography";
import {
  blackColor,
  greyColor,
  gutters,
  guttersPx,
  whiteColor,
  darkblueColor,
} from "@/styles/variables";
import { formatedValues, isBrowser } from "@/utils/helperUtils";
import { useMutation } from "@apollo/client";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import React, { useEffect, useMemo, useState } from "react";

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import ButtonNewDeal from "../ui/button/ButtonNewDeal";
import { SkeletonLoading } from "../ui/loader/SkeletonLoading";
import Modal from "../ui/modal/Modal";
import DealAction, { ActionComponents } from "./DealAction";
import DealDetailByUsers from "./dealdetails/DealDetailByUsers";

export interface BoardObj {
  name: string;
  title: string;
  price: number;
  profiles: string[];
  item: any;
  id: string;
}

const AllSections = styled.div<{
  index: string | number;
  lastIndex: number | string;
}>(
  ({ index, lastIndex }) => css`
    background: #a8d8cc;
    width: 100%;
    padding: 10px 0;
    position: relative;
    ${chekIndex(index, lastIndex)};
  `,
);

const ProfileWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 15px 10px 0px 10px;
`;
const HeadingsWrapper = styled.div`
  padding: 10px ${guttersPx.large};
`;
const Title = styled.h3(
  [typographySubtitle1],
  `
color:${blackColor}
`,
);
const SubTitle = styled.div(
  [typographySubtitle2Normal],
  `
 color:${greyColor};
line-height:21px
`,
);
const Sections = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: nowrap !important;
  align-items: strech;
  min-height: 100vh;
  ${mqMax.large} {
    flex-wrap: wrap;
    flex-direction: column;
  }
`;
const ActionWrapper = styled.div<{
  isAction: boolean;
}>(
  ({ isAction }) => css`
    position: fixed;
    z-index: ${!isAction ? 0 : 10};
    display: flex;
    visibility: ${isAction ? "visible" : "hidden"};
    bottom: 0;
    box-shadow: 0px 0.5px 4px 0px rgba(0, 0, 0, 0.25);
    border-top: 2px solid #000;
    background: ${whiteColor};
    padding: 0 ${gutters.large}px;
    width: calc(100% - 114px);
    gap: ${guttersPx.medium};
    height: 120px;
  `,
);
const ListWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const DealPostButton = styled.div<{
  isAction: boolean;
}>(
  ({ isAction }) => css`
    position: absolute;
    top: -111px;
    right: 270px;
    z-index: ${isAction ? "999" : "0"};
    button {
      position: fixed;
      background: transparent;
      color: ${darkblueColor};
      border: 1px solid ${darkblueColor};
    }
  `,
);

const DealList = () => {
  const {
    dealListData,
    listData,
    setDealListData,
    handleDealActions,
    dealDetailModal,
    setDealDetailModal,
    setDealId,
    dealId,
  } = useQueryContext();

  const [handleDealupdate] = useMutation(UPDATE_DEAL, {
    onCompleted: listData,
  });
  const router = useRouter();
  const [isopen, setIsopen] = useState(false);
  const [actiontext, setActionText] = useState<any>(null);
  const [isAction, setIsAction] = useState(false);
  const lastlength = Object.entries(dealListData || {})?.length;
  const onDragEnd = (
    result: DropResult,
    allListdata: { [key: string]: any },
    listFun: {
      (value: React.SetStateAction<Record<string, BoardObj>>): void;
      (arg0: { [x: string]: any }): void;
    },
  ) => {
    if (!result.destination) {
      setIsAction(false);
      return;
    }
    if (result.destination.droppableId === "add to post") {
      router.push("/schedulePost");
      return;
    }
    const { source, destination } = result;

    if (destination?.droppableId === "lost") {
      setActionText({ type: "lost", id: result.draggableId });
      handleDealActions(destination?.droppableId, true);
      setIsAction(false);
      return;
    }
    if (destination?.droppableId === "won") {
      handleDealActions(destination?.droppableId, true);
      setActionText({ type: "won", id: result.draggableId });
      setIsAction(false);
      return;
    }
    if (destination?.droppableId === "delete") {
      handleDealActions(destination?.droppableId, true);
      setActionText({ type: "delete", id: result.draggableId });
      setIsAction(false);
      return;
    }
    const sourceColumn = allListdata?.[source.droppableId];
    const destColumn = allListdata?.[destination.droppableId];
    setIsAction(false);
    handleDealupdate({
      variables: {
        input: {
          stage: destColumn.id,
          id: result.draggableId,
        },
      },
    });
    if (source.droppableId !== destination.droppableId) {
      const sourceItems = [...sourceColumn.item];
      const destItems = [...destColumn.item];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      listFun({
        ...allListdata,
        [source.droppableId]: {
          ...sourceColumn,
          item: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          item: destItems,
        },
      });
    } else {
      const column = allListdata[source.droppableId];
      const copiedItems = [...column.item];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      listFun({
        ...allListdata,
        [source.droppableId]: {
          ...column,
          item: copiedItems,
        },
      });
    }
  };

  useEffect(() => {
    if (isBrowser) {
      listData();
      setIsopen(true);
    }
  }, []);

  const handleDragStart = (item: { source: any }) => {
    if (!item.source) return;
    setIsAction(true);
    console.log(item);
  };

  const onProfileOpen = (id: string) => {
    setDealDetailModal(true);
    setDealId(id);
  };

  const modalComponents = useMemo(() => {
    return (
      <Modal
        open={dealDetailModal}
        maxWidth={false}
        width="1000"
        closeModal={() => {
          setDealDetailModal(false);
        }}
      >
        <DealDetailByUsers
          id={dealId}
          handleProfileModal={setDealDetailModal}
        />
      </Modal>
    );
  }, [dealDetailModal, dealId]);
  const modalInstance = [
    "ModalInstance",
    "ModalInstance1",
    "ModalInstance2",
    "ModalInstance3",
    "ModalInstance4",
  ];
  if (!isopen || !dealListData) {
    return (
      <Sections>
        {modalInstance.map((_item, index) => (
          <AllSections key={index} index={index} lastIndex={lastlength - 1}>
            <SkeletonLoading />
          </AllSections>
        ))}
      </Sections>
    );
  }

  return (
    <ListWrapper>
      <DragDropContext
        onDragStart={handleDragStart}
        onDragEnd={(result) => onDragEnd(result, dealListData, setDealListData)}
      >
        <Sections>
          {Object.entries(dealListData as BoardObj)?.map(
            ([listId, list], index) => {
              const { item } = list;

              const prices: string =
                Object.entries(dealListData as Record<string, any>)[index][1]
                  ?.price ?? "";
              return isopen ? (
                <Droppable droppableId={listId} key={listId}>
                  {(provided) => {
                    return (
                      <AllSections
                        key={index}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        index={index}
                        lastIndex={lastlength - 1}
                      >
                        <HeadingsWrapper>
                          <Title>{list?.title}</Title>
                          <SubTitle>{formatedValues(prices)}€</SubTitle>
                        </HeadingsWrapper>
                        {item?.map(
                          (
                            itemlist: {
                              id: string;
                              dealManagement_isLost: boolean;
                            },
                            listindex: number,
                          ) => {
                            return (
                              <Draggable
                                key={itemlist?.id}
                                draggableId={itemlist?.id}
                                index={listindex}
                                isDragDisabled={
                                  itemlist?.dealManagement_isLost !== null
                                }
                              >
                                {(providedList) => {
                                  return (
                                    <ProfileWrapper
                                      ref={providedList.innerRef}
                                      {...providedList.draggableProps}
                                      {...providedList.dragHandleProps}
                                    >
                                      <ProfileCard
                                        data={itemlist}
                                        onProfileOpen={onProfileOpen}
                                      />
                                    </ProfileWrapper>
                                  );
                                }}
                              </Draggable>
                            );
                          },
                        )}
                      </AllSections>
                    );
                  }}
                </Droppable>
              ) : null;
            },
          )}
        </Sections>
        <ActionWrapper isAction={isAction}>
          <DealAction isopen={isopen} />
        </ActionWrapper>
        <Droppable droppableId="add to post" key="add to post">
          {(provided) => {
            return (
              <DealPostButton
                isAction={isAction}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <ButtonNewDeal>Add to post</ButtonNewDeal>
              </DealPostButton>
            );
          }}
        </Droppable>
      </DragDropContext>
      <ActionComponents type={actiontext?.type} id={actiontext?.id} />
      {modalComponents}
    </ListWrapper>
  );
};

export default DealList;

export const chekIndex = (fIndex: string | number, lIndex: string | number) => {
  let style: string = "";
  if (fIndex !== lIndex) {
    style += `&::before {
      content: "";
      position: absolute;
      right: -9px;
      ${mqMax.desktop}{
        right: -8px;
      };
      bottom: 0;
      width: 0;
      top:0;
      height: 0;
      border-left: 10px solid #a8d8cc;
      border-top: 25px solid transparent;
      border-bottom: 24px solid transparent;
    }`;
  }
  if (fIndex !== 0) {
    style += `&::after {
    content: "";
    position: absolute;
    top:0;
    left: 0;
    bottom: 0;
    width: 0;
    height: 0;
    border-left: 10px solid white;
    border-top: 25px solid transparent;
    border-bottom: 25px solid transparent;`;
  }
  return style;
};

export const convertArrayToKanbanBoards = (arr: any[]) => {
  const kanbanBoards: Record<string, BoardObj> = {};
  arr?.forEach((board: any) => {
    const { boardName, price, dealdata, id } = board;
    const boardObj = {
      name: boardName,
      title: boardName,
      price: price,
      profiles: [],
      item: dealdata,
      id: id,
    };
    kanbanBoards[boardName] = boardObj;
  });

  return kanbanBoards;
};
