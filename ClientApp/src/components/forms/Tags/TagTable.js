import React, { useState } from "react";
import "rsuite/dist/rsuite.min.css";
import { useNavigate } from "react-router-dom";

import { Table, ButtonToolbar, IconButton } from "rsuite";

import TrashIcon from "@rsuite/icons/Trash";
import DeleteTagModal from "./DeleteTagModal";

const { Column, HeaderCell, Cell } = Table;

const TagTable = ({ tags, getTransaction }) => {
  const navigate = useNavigate();

  const [showDelTagModal, setShowDelTagModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);

  const handleDeleteTag = (tag) => {
    setSelectedTag(tag);
    setShowDelTagModal(true);
  };

  const handleModalClose = () => {
    setShowDelTagModal(false);
    setSelectedTag(null);
    getTransaction();
  };

  return (
    <>
      <Table
        data={tags}
        height={200}
        rowHeight={50}
        headerHeight={50}
        autoHeight
        virtualized
        bordered
      >
        <Column width={100} fixed align="center" resizable sortable>
          <HeaderCell>Name</HeaderCell>
          <Cell dataKey="name" />
        </Column>
        <Column width={200} align="center" resizable sortable>
          <HeaderCell>Description</HeaderCell>
          <Cell dataKey="description" />
        </Column>
        <Column width={150} fixed="right" align="center" resizable>
          <HeaderCell>Delete</HeaderCell>
          <Cell>
            {(rowData) => (
              <ButtonToolbar>
                <IconButton
                  icon={<TrashIcon />}
                  size="xs"
                  appearance="ghost"
                  color="red"
                  onClick={() => handleDeleteTag(rowData)}
                />
              </ButtonToolbar>
            )}
          </Cell>
        </Column>
      </Table>
      <DeleteTagModal
        showModal={showDelTagModal}
        tag={selectedTag}
        onClose={handleModalClose}
      />
    </>
  );
};

export default TagTable;
