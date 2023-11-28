import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider, Link,
  Typography
} from '@mui/material';

export const TokenCard = ({ token }) => {
  const onClick = () => {

  }

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Avatar
            sx={{
              height: 80,
              mb: 2,
              width: 80
            }}
          />
          <Typography
            gutterBottom
            variant="h5"
          >
            {token.name}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            Balance: {token.quantity}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        {
          token.isToMint
            ? (
              <Button
                fullWidth
                variant="text"
                onClick={onClick}
              >
                Mint +1000
              </Button>
            )
            : (
              <Link
                sx={{textAlign: 'center', width: '100%'}}
                href={token.linkGetMore}
                target={'_blank'}
                className={'MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButton-fullWidth MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButton-fullWidth css-ir6wn7-MuiButtonBase-root-MuiButton-root'}
              >
                Get More
              </Link>
            )
        }
      </CardActions>
    </Card>
  );
}