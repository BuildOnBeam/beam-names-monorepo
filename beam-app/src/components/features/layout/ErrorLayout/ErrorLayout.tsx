import { ErrorLayoutProps } from './ErrorLayout.types';
import { css } from '@onbeam/styled-system/css';
import { text, vstack } from '@onbeam/styled-system/patterns';
import { ErrorIcon } from '@onbeam/icons';
import { Card } from '@onbeam/ui';

export const ErrorLayout = ({
  title = 'Error',
  description = "We've encountered an unexpected error, please try again later.",
  errorCode,
  children,
}: ErrorLayoutProps) => (
  <Card
    size="lg"
    className={vstack({
      align: 'center',
      my: 'auto',
      mx: 'auto',
    })}
  >
    <ErrorIcon height={48} width={48} />
    <h1 className={text({ style: 'xl', mt: '4', mb: '1' })}>{title}</h1>
    <p
      className={text({
        align: 'center',
        color: 'mono.300',
      })}
    >
      {description}
      {!!errorCode && (
        <>
          <br />
          Error code: {errorCode}
        </>
      )}
    </p>
    {!!children && (
      <div className={css({ mt: '10', w: 'full' })}>{children}</div>
    )}
  </Card>
);
