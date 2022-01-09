import { useDispatch } from "react-redux";
import * as S from "@components/CreatePost/Post.styled";
import { addTitle } from "./titleSlice";

export default function InputTitle() {
  const dispatch = useDispatch();
  return (
    <S.InputForm
      autoComplete="title"
      autoFocus={true}
      placeholder={"Type your title here"}
      onChange={e =>
        // Maybe we need value autoComplete in sign up form
        dispatch(
          addTitle({
            title: e.target.value
          })
        )
      }
    />
  );
}
