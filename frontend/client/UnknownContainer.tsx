import React from 'react';

import { useUnknown } from './Data';
import { isSuccess, isFailure } from './LoadingState';
import Unknown from './Unknown';
import Error from './Error';
import Loading from './Loading';

interface UnknownContainerProps {

}

const UnknownContainer: React.FC<UnknownContainerProps> = () => {
  const [loadState, reload] = useUnknown();

  return (
    <div className="content">
      {isSuccess(loadState)
        ? <Unknown data={loadState.data} handleRefresh={reload} />
        : isFailure(loadState)
          ? <Error onTryAgain={reload} />
          : <Loading />
       }
    </div>
  );
};

export default UnknownContainer;
