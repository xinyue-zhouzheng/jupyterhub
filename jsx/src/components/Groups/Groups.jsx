import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { usePaginationParams } from "../../util/paginationParams";
import PaginationFooter from "../PaginationFooter/PaginationFooter";
import { MainContainer } from "../../util/layout";

const Groups = (props) => {
  const groups_data = useSelector((state) => state.groups_data);
  const groups_page = useSelector((state) => state.groups_page);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { setOffset, offset, handleLimit, limit, setPagination } =
    usePaginationParams();

  const total = groups_page ? groups_page.total : undefined;

  const { updateGroups } = props;

  const dispatchPageUpdate = (data, page) => {
    setPagination(page);
    dispatch({
      type: "GROUPS_PAGE",
      value: {
        data: data,
        page: page,
      },
    });
  };

  useEffect(() => {
    updateGroups(offset, limit).then((data) =>
      dispatchPageUpdate(data.items, data._pagination),
    );
  }, [offset, limit]);

  if (!groups_data || !groups_page) {
    return <div data-testid="no-show"></div>;
  }

  return (
    <MainContainer>
      <Card>
        <Card.Header>
          <h4>Groups</h4>
        </Card.Header>
        <Card.Body>
          <ul className="list-group">
            {groups_data.length > 0 ? (
              groups_data.map((e, i) => (
                <li className="list-group-item" key={"group-item" + i}>
                  <span className="badge rounded-pill bg-success mx-2">
                    {e.users.length + " users"}
                  </span>
                  <Link to="/group-edit" state={{ group_data: e }}>
                    {e.name}
                  </Link>
                </li>
              ))
            ) : (
              <div>
                <h4>no groups created...</h4>
              </div>
            )}
          </ul>
          <PaginationFooter
            offset={offset}
            limit={limit}
            visible={groups_data.length}
            total={total}
            next={() => setOffset(offset + limit)}
            prev={() => setOffset(offset - limit)}
            handleLimit={handleLimit}
          />
        </Card.Body>
        <Card.Footer>
          <Link to="/">
            <Button variant="light" id="return">
              Back
            </Button>
          </Link>
          <span> </span>
          <Link to="/create-group">
            <Button variant="primary">New Group</Button>
          </Link>
        </Card.Footer>
      </Card>
    </MainContainer>
  );
};

Groups.propTypes = {
  updateUsers: PropTypes.func,
  updateGroups: PropTypes.func,
};

export default Groups;
