import type { ComponentProps } from "react"

export type IconProps = ComponentProps<"svg"> & {
  size?: number | string
}

const ICON_SIZE = 32

export const Icons = {
  nextJs: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fill="none">
        <g clipPath="url(#a)">
          <path
            fill="currentColor"
            d="M11.214.006c-.052.005-.216.022-.364.033-3.408.308-6.6 2.147-8.624 4.974a11.9 11.9 0 00-2.118 5.243c-.096.66-.108.854-.108 1.748s.012 1.089.108 1.748c.652 4.507 3.86 8.293 8.209 9.696.779.251 1.6.422 2.533.526.364.04 1.936.04 2.3 0 1.611-.179 2.977-.578 4.323-1.265.207-.105.247-.134.219-.157a212 212 0 01-1.955-2.62l-1.919-2.593-2.404-3.559a343 343 0 00-2.422-3.556c-.009-.003-.018 1.578-.023 3.51-.007 3.38-.01 3.516-.052 3.596a.43.43 0 01-.206.213c-.075.038-.14.045-.495.045H7.81l-.108-.068a.44.44 0 01-.157-.172l-.05-.105.005-4.704.007-4.706.073-.092a.6.6 0 01.174-.143c.096-.047.133-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 2 2.895 4.362l4.734 7.172 1.9 2.878.097-.063a12.3 12.3 0 002.465-2.163 11.95 11.95 0 002.825-6.135c.096-.66.108-.854.108-1.748s-.012-1.088-.108-1.748C23.24 5.75 20.032 1.963 15.683.56a12.6 12.6 0 00-2.498-.523c-.226-.024-1.776-.05-1.97-.03m4.913 7.26a.47.47 0 01.237.276c.018.06.023 1.365.018 4.305l-.007 4.218-.743-1.14-.746-1.14V10.72c0-1.983.009-3.097.023-3.151a.48.48 0 01.232-.296c.097-.05.132-.054.5-.054.347 0 .408.005.486.047"
          />
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h24v24H0z" />
          </clipPath>
        </defs>
      </g>
    </svg>
  ),
  drizzle: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill="#4caf50"
        d="M5.22 23.118l3.647-6.593a1.712 1.712 0 10-2.996-1.657L2.224 21.46a1.712 1.712 0 002.996 1.658m12.02 0l3.648-6.593a1.712 1.712 0 10-2.996-1.657l-3.648 6.592a1.712 1.712 0 002.996 1.658m-3.378-5.96l3.88-6.588a1.706 1.706 0 00-2.94-1.73l-3.88 6.588a1.706 1.706 0 002.94 1.73m12.028 0l3.88-6.588a1.706 1.706 0 00-2.94-1.73l-3.88 6.588a1.706 1.706 0 002.94 1.73"
      />
    </svg>
  ),
  betterAuth: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill="currentColor"
        d="M0 3.39v17.22h5.783v-5.55h6.434V8.939H5.783V3.39zm12.217 5.55h5.638v6.122h-5.638v5.548H24V3.391H12.217z"
      />
    </svg>
  ),
  tanStack: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill="currentColor"
        d="M11.078.042c.316-.042.65-.014.97-.014c1.181 0 2.341.184 3.472.532a12.3 12.3 0 0 1 3.973 2.086a11.9 11.9 0 0 1 3.432 4.33c1.446 3.15 1.436 6.97-.046 10.107c-.958 2.029-2.495 3.727-4.356 4.965c-1.518 1.01-3.293 1.629-5.1 1.848c-2.298.279-4.784-.129-6.85-1.188c-3.88-1.99-6.518-5.994-6.57-10.382c-.01-.846.003-1.697.17-2.534c.273-1.365.748-2.683 1.463-3.88a12 12 0 0 1 2.966-3.36A12.3 12.3 0 0 1 9.357.3a12 12 0 0 1 1.255-.2l.133-.016zM7.064 19.99c-.535.057-1.098.154-1.557.454c.103.025.222 0 .33 0c.258 0 .52-.01.778.002c.647.028 1.32.131 1.945.303c.8.22 1.505.65 2.275.942c.813.307 1.622.402 2.484.402c.435 0 .866-.001 1.287-.12c-.22-.117-.534-.095-.778-.144a11 11 0 0 1-1.556-.416a12 12 0 0 1-1.093-.467l-.23-.108a15 15 0 0 0-1.012-.44c-.905-.343-1.908-.512-2.873-.408m.808-2.274c-1.059 0-2.13.187-3.083.667q-.346.177-.659.41c-.063.046-.175.106-.199.188s.061.151.11.204c.238-.127.464-.261.718-.357c1.64-.624 3.63-.493 5.268.078c.817.285 1.569.712 2.365 1.046c.89.374 1.798.616 2.753.74c1.127.147 2.412.028 3.442-.48c.362-.179.865-.451 1.018-.847c-.189.017-.36.098-.539.154a9 9 0 0 1-.868.222c-.994.2-2.052.24-3.053.06c-.943-.17-1.82-.513-2.693-.873l-.111-.046l-.223-.092l-.112-.046a26 26 0 0 0-1.35-.527c-.89-.31-1.842-.5-2.784-.5M9.728 1.452c-1.27.28-2.407.826-3.502 1.514c-.637.4-1.245.81-1.796 1.323c-.82.765-1.447 1.695-1.993 2.666c-.563 1-.924 2.166-1.098 3.297c-.172 1.11-.2 2.277-.004 3.388c.245 1.388.712 2.691 1.448 3.897c.248-.116.424-.38.629-.557c.414-.359.85-.691 1.317-.978a3.5 3.5 0 0 1 .539-.264c.07-.029.187-.055.22-.132c.053-.124-.045-.34-.062-.468a7 7 0 0 1-.068-1.109a9.7 9.7 0 0 1 .61-3.177c.29-.76.73-1.45 1.254-2.069c.177-.21.365-.405.56-.6c.115-.114.258-.212.33-.359c-.376 0-.751.108-1.108.218c-.769.237-1.518.588-2.155 1.084c-.291.226-.504.522-.779.76c-.084.073-.235.17-.352.116c-.176-.083-.149-.43-.169-.59c-.078-.612.154-1.387.45-1.918c.473-.852 1.348-1.58 2.376-1.555c.444.011.833.166 1.257.266c-.107-.153-.252-.264-.389-.39a5.4 5.4 0 0 0-1.107-.8c-.163-.085-.338-.136-.509-.2c-.086-.03-.195-.074-.227-.17c-.06-.177.26-.342.377-.417c.453-.289 1.01-.527 1.556-.54c.854-.021 1.688.452 2.04 1.258c.123.284.16.583.184.885l.004.057l.006.085l.002.029l.005.057l.004.056c.268-.218.457-.54.718-.774c.612-.547 1.45-.79 2.245-.544a2.97 2.97 0 0 1 1.71 1.378c.097.173.365.595.171.767c-.152.134-.344.03-.504-.026a3 3 0 0 0-.372-.094l-.068-.014l-.069-.013a3.9 3.9 0 0 0-1.377-.002c-.282.05-.557.15-.838.192v.06c.768.006 1.51.444 1.89 1.109c.157.275.235.59.295.9c.075.38.022.796-.082 1.168c-.035.125-.098.336-.247.365c-.106.02-.195-.085-.256-.155a4.6 4.6 0 0 0-.492-.522a20 20 0 0 0-1.467-1.14c-.267-.19-.56-.44-.868-.556c.087.208.171.402.2.63c.088.667-.192 1.296-.612 1.798a2.6 2.6 0 0 1-.426.427c-.067.05-.151.114-.24.1c-.277-.044-.31-.463-.353-.677c-.144-.726-.086-1.447.114-2.158c-.178.09-.307.287-.418.45a5.3 5.3 0 0 0-.612 1.138c-.61 1.617-.604 3.51.186 5.066c.088.174.221.15.395.15h.157a3 3 0 0 1 .472.018c.08.01.193 0 .257.06c.077.072.036.194.018.282c-.05.246-.066.469-.066.72c.328-.051.419-.576.535-.84c.131-.298.265-.597.387-.9c.06-.148.14-.314.119-.479c-.024-.185-.157-.381-.25-.54c-.177-.298-.378-.606-.508-.929c-.104-.258-.007-.58.286-.672c.161-.05.334.049.439.166c.22.244.363.609.523.896l1.249 2.248q.159.286.32.57c.043.074.086.188.173.219c.077.028.182-.012.26-.027c.198-.04.398-.083.598-.12c.24-.043.605-.035.778-.222c-.253-.08-.545-.075-.808-.057c-.158.01-.333.067-.479-.025c-.216-.137-.36-.455-.492-.667c-.326-.525-.633-1.057-.945-1.59l-.05-.084l-.1-.17q-.075-.126-.149-.255c-.037-.066-.092-.153-.039-.227c.056-.076.179-.08.29-.081h.021q.066.001.117-.004a10 10 0 0 1 1.347-.107c-.035-.122-.135-.26-.103-.39c.071-.292.49-.383.686-.174c.131.14.207.334.292.504c.113.223.24.44.361.66c.211.383.441.757.658 1.138l.055.094l.028.047c.093.156.187.314.238.489c-.753-.035-1.318-.909-1.646-1.499c-.027.095.016.179.05.27q.103.282.262.54c.152.244.326.495.556.673c.408.315.945.317 1.436.283c.315-.022.708-.165 1.018-.068s.434.438.25.7c-.138.196-.321.27-.55.3c.162.346.373.667.527 1.02c.064.146.13.37.283.448c.102.051.248.003.358 0c-.11-.292-.317-.54-.419-.839c.31.015.61.176.898.28c.567.202 1.128.424 1.687.648l.258.104c.23.092.462.183.689.283c.083.037.198.123.29.07c.074-.043.123-.146.169-.215a10.3 10.3 0 0 0 1.393-3.208c.75-2.989.106-6.287-1.695-8.783c-.692-.96-1.562-1.789-2.522-2.476c-2.401-1.718-5.551-2.407-8.44-1.768m4.908 14.904c-.636.166-1.292.317-1.945.401c.086.293.296.577.45.84c.059.101.122.237.24.281c.132.05.292-.03.417-.072c-.058-.158-.155-.3-.235-.45c-.033-.06-.084-.133-.056-.206c.05-.137.263-.13.381-.153c.31-.063.617-.142.928-.204c.114-.023.274-.085.389-.047c.086.03.138.1.187.174l.022.033q.043.07.097.122c.125.113.313.13.472.162c-.097-.219-.259-.41-.362-.63c-.06-.127-.11-.315-.242-.388c-.182-.102-.557.089-.743.137m-4.01-1.457c-.03.38-.147.689-.33 1.019c.21.026.423.036.629.087c.154.038.296.11.449.153c-.082-.224-.233-.423-.35-.63c-.12-.208-.226-.462-.398-.63"
      />
    </svg>
  ),
  resend: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill="currentColor"
        d="M2.023 0v24h5.553v-8.434h2.998L15.326 24h6.65l-5.372-9.258a7.65 7.65 0 003.316-3.016q1.063-1.815 1.062-4.08 0-2.194-1.062-3.91-1.063-1.747-2.95-2.742Q15.12 0 12.823 0zm5.553 4.87h4.219q1.097 0 1.851.376.788.378 1.2 1.098.412.685.412 1.611c0 .926-.126 1.165-.378 1.645q-.343.72-1.03 1.13-.651.379-1.542.38H7.576z"
      />
    </svg>
  ),
  neon: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M63 0.0177909V63.5526L38.4178 42.2501V63.5526H0V0L63 0.0177909ZM7.72251 55.8389H30.6953V25.3238L55.2779 47.0476V7.72922L7.72251 7.71559V55.8389Z"
        fill="#37C38F"
      />
    </svg>
  ),
  typeScript: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 27 26"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="m.98608 0h24.32332c.5446 0 .9861.436522.9861.975v24.05c0 .5385-.4415.975-.9861.975h-24.32332c-.544597 0-.98608-.4365-.98608-.975v-24.05c0-.538478.441483-.975.98608-.975zm13.63142 13.8324v-2.1324h-9.35841v2.1324h3.34111v9.4946h2.6598v-9.4946zm1.0604 9.2439c.4289.2162.9362.3784 1.5218.4865.5857.1081 1.2029.1622 1.8518.1622.6324 0 1.2331-.0595 1.8023-.1784.5691-.1189 1.0681-.3149 1.497-.5879s.7685-.6297 1.0187-1.0703.3753-.9852.3753-1.6339c0-.4703-.0715-.8824-.2145-1.2365-.1429-.3541-.3491-.669-.6186-.9447-.2694-.2757-.5925-.523-.9692-.7419s-.8014-.4257-1.2743-.6203c-.3465-.1406-.6572-.2771-.9321-.4095-.275-.1324-.5087-.2676-.7011-.4054-.1925-.1379-.3409-.2838-.4454-.4379-.1045-.154-.1567-.3284-.1567-.523 0-.1784.0467-.3392.1402-.4824.0935-.1433.2254-.2663.3959-.369s.3794-.1824.6269-.2392c.2474-.0567.5224-.0851.8248-.0851.22 0 .4523.0162.697.0486.2447.0325.4908.0825.7382.15.2475.0676.4881.1527.7218.2555.2337.1027.4495.2216.6475.3567v-2.4244c-.4015-.1514-.84-.2636-1.3157-.3365-.4756-.073-1.0214-.1095-1.6373-.1095-.6268 0-1.2207.0662-1.7816.1987-.5609.1324-1.0544.3392-1.4806.6203s-.763.6392-1.0104 1.0743c-.2475.4352-.3712.9555-.3712 1.5609 0 .7731.2268 1.4326.6805 1.9785.4537.546 1.1424 1.0082 2.0662 1.3866.363.146.7011.2892 1.0146.4298.3134.1405.5842.2865.8124.4378.2282.1514.4083.3162.5403.4946s.198.3811.198.6082c0 .1676-.0413.323-.1238.4662-.0825.1433-.2076.2676-.3753.373s-.3766.1879-.6268.2473c-.2502.0595-.5431.0892-.8785.0892-.5719 0-1.1383-.0986-1.6992-.2959-.5608-.1973-1.0805-.4933-1.5589-.8879z"
        className="fill-blue-400"
      ></path>
    </svg>
  ),
  tailwind: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 54 33" fill="none" {...props}>
      <title>Tailwind CSS</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"
        fill="#06B6D4"
      />
    </svg>
  ),
  zod: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill="white"
        d="M2.584 3.582a2.25 2.25 0 012.112-1.479h14.617c.948 0 1.794.595 2.115 1.487l2.44 6.777a2.25 2.25 0 01-.624 2.443l-9.61 8.52a2.25 2.25 0 01-2.963.018L.776 12.773a2.25 2.25 0 01-.64-2.467z"
      />
      <path
        className="fill-blue-400"
        d="M2.584 3.582a2.25 2.25 0 012.112-1.479h14.617c.948 0 1.794.595 2.115 1.487l2.44 6.777a2.25 2.25 0 01-.624 2.443l-9.61 8.52a2.25 2.25 0 01-2.963.018L.776 12.773a2.25 2.25 0 01-.64-2.467zm12.038 4.887l-9.11 5.537 5.74 5.007a1.206 1.206 0 001.593-.006l5.643-5.001H14.4l6.239-3.957c.488-.328.69-.947.491-1.5l-1.24-3.446a1.535 1.535 0 00-1.456-1.015H5.545a1.535 1.535 0 00-1.431 1.01l-1.228 3.37z"
      />
    </svg>
  ),
  motion: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M48.379 39.997L23.063 88.003H0L19.77 50.52c3.064-5.814 10.708-10.523 17.078-10.523zM104.937 52c0-6.631 5.162-12.002 11.531-12.002S128 45.368 128 52c0 6.629-5.162 12-11.532 12-6.369 0-11.531-5.37-11.531-12.001M52.703 39.997h23.063L50.45 88.003H27.387zm27.238 0h23.063L83.241 77.48c-3.065 5.814-10.715 10.523-17.084 10.523H54.625z" />
    </svg>
  ),
  discord: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      className="size-4"
      fill="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      <title>Discord</title>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  ),
  gitHub: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      {...props}
    >
      <title>Github</title>
      <path
        clipRule="evenodd"
        d="M8 1.46252C4.40875 1.46252 1.5 4.37029 1.5 7.96032C1.5 10.8356 3.36062 13.2642 5.94438 14.1251C6.26937 14.182 6.39125 13.987 6.39125 13.8165C6.39125 13.6621 6.38313 13.1504 6.38313 12.6063C4.75 12.9068 4.3275 12.2083 4.1975 11.8428C4.12437 11.6559 3.8075 11.0793 3.53125 10.9249C3.30375 10.8031 2.97875 10.5026 3.52312 10.4945C4.035 10.4863 4.40062 10.9656 4.5225 11.1605C5.1075 12.1433 6.04188 11.8671 6.41563 11.6966C6.4725 11.2742 6.64313 10.9899 6.83 10.8275C5.38375 10.665 3.8725 10.1046 3.8725 7.61919C3.8725 6.91255 4.12438 6.32775 4.53875 5.87291C4.47375 5.71046 4.24625 5.04444 4.60375 4.15099C4.60375 4.15099 5.14812 3.98042 6.39125 4.81701C6.91125 4.67081 7.46375 4.59771 8.01625 4.59771C8.56875 4.59771 9.12125 4.67081 9.64125 4.81701C10.8844 3.9723 11.4288 4.15099 11.4288 4.15099C11.7863 5.04444 11.5588 5.71046 11.4938 5.87291C11.9081 6.32775 12.16 6.90443 12.16 7.61919C12.16 10.1127 10.6406 10.665 9.19438 10.8275C9.43 11.0305 9.63313 11.4204 9.63313 12.0296C9.63313 12.8987 9.625 13.5972 9.625 13.8165C9.625 13.987 9.74687 14.1901 10.0719 14.1251C11.3622 13.6896 12.4835 12.8606 13.2779 11.7547C14.0722 10.6488 14.4997 9.32178 14.5 7.96032C14.5 4.37029 11.5913 1.46252 8 1.46252Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  ),
  x: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      {...props}
    >
      <title>X</title>
      <path
        clipRule="evenodd"
        d="M1.60022 2H5.80022L8.78759 6.16842L12.4002 2H14.0002L9.5118 7.17895L14.4002 14H10.2002L7.21285 9.83158L3.60022 14H2.00022L6.48864 8.82105L1.60022 2ZM10.8166 12.8L3.93657 3.2H5.18387L12.0639 12.8H10.8166Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  ),
  linkedIn: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      {...props}
    >
      <title>LinkedIn</title>
      <path
        clipRule="evenodd"
        d="M3.5 2C2.67157 2 2 2.67157 2 3.5V12.5C2 13.3284 2.67157 14 3.5 14H12.5C13.3284 14 14 13.3284 14 12.5V3.5C14 2.67157 13.3284 2 12.5 2H3.5ZM4.74556 5.5C5.21057 5.5 5.5 5.16665 5.5 4.75006C5.49133 4.3241 5.21057 4 4.75438 4C4.29824 4 4 4.3241 4 4.75006C4 5.16665 4.28937 5.5 4.73687 5.5H4.74556ZM5.5 6.5V12H4V6.5H5.5ZM7 12H8.5V8.89479C8.5 8.89479 8.60415 7.78962 9.55208 7.78962C10.5 7.78962 10.5 9.02275 10.5 9.02275V12H12V8.8133C12 7.13837 11.25 6.5025 10.125 6.5025C9 6.5025 8.5 7.27778 8.5 7.27778V6.5025H7.00005C7.02383 7.01418 7 12 7 12Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  ),
  google: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Google</title>
      <g clipRule="evenodd" fill="none" fillRule="evenodd">
        <path
          d="M7.209 1.061c.725-.081 1.154-.081 1.933 0a6.57 6.57 0 0 1 3.65 1.82a100 100 0 0 0-1.986 1.93q-1.876-1.59-4.188-.734q-1.696.78-2.362 2.528a78 78 0 0 1-2.148-1.658a.26.26 0 0 0-.16-.027q1.683-3.245 5.26-3.86"
          fill="#f44336"
          opacity={0.987}
        />
        <path
          d="M1.946 4.92q.085-.013.161.027a78 78 0 0 0 2.148 1.658A7.6 7.6 0 0 0 4.04 7.99q.037.678.215 1.331L2 11.116Q.527 8.038 1.946 4.92"
          fill="#ffc107"
          opacity={0.997}
        />
        <path
          d="M12.685 13.29a26 26 0 0 0-2.202-1.74q1.15-.812 1.396-2.228H8.122V6.713q3.25-.027 6.497.055q.616 3.345-1.423 6.032a7 7 0 0 1-.51.49"
          fill="#448aff"
          opacity={0.999}
        />
        <path
          d="M4.255 9.322q1.23 3.057 4.51 2.854a3.94 3.94 0 0 0 1.718-.626q1.148.812 2.202 1.74a6.62 6.62 0 0 1-4.027 1.684a6.4 6.4 0 0 1-1.02 0Q3.82 14.524 2 11.116z"
          fill="#43a047"
          opacity={0.993}
        />
      </g>
    </svg>
  ),
  shadcn: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      {...props}
    >
      <line
        x1="208"
        y1="128"
        x2="128"
        y2="208"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <line
        x1="192"
        y1="40"
        x2="40"
        y2="192"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
    </svg>
  ),
  baseui: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 17 24"
      fill="currentcolor"
      aria-label="Base UI"
      {...props}
    >
      <path d="M9.5001 7.01537C9.2245 6.99837 9 7.22385 9 7.49999V23C13.4183 23 17 19.4183 17 15C17 10.7497 13.6854 7.27351 9.5001 7.01537Z"></path>
      <path d="M8 9.8V12V23C3.58172 23 0 19.0601 0 14.2V12V1C4.41828 1 8 4.93989 8 9.8Z"></path>
    </svg>
  ),
  viteplus: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 36 20"
      {...props}
    >
      <path
        fill="#6254fe"
        d="M17.85 19.535a.483.483 0 0 1-.864-.298v-4.403a.967.967 0 0 0-.967-.967h-4.862a.483.483 0 0 1-.393-.764l3.197-4.475a.967.967 0 0 0-.788-1.53H7.29a.483.483 0 0 1-.393-.764L11.04.533a.48.48 0 0 1 .394-.203h12.348c.393 0 .622.445.393.764L20.978 5.57c-.457.64 0 1.53.788 1.53h4.861c.404 0 .63.464.38.782L17.85 19.536"
      />
      <mask
        id="a"
        x="6"
        y="0"
        maskUnits="userSpaceOnUse"
        style={{ maskType: "alpha" }}
      >
        <path
          fill="#833bff"
          d="M17.85 19.535a.483.483 0 0 1-.864-.298v-4.403a.967.967 0 0 0-.967-.967h-4.862a.483.483 0 0 1-.393-.764l3.197-4.475a.967.967 0 0 0-.788-1.53H7.29a.483.483 0 0 1-.393-.764L11.04.533a.48.48 0 0 1 .394-.203h12.348c.393 0 .622.445.393.764L20.978 5.57c-.457.64 0 1.53.788 1.53h4.861c.404 0 .63.464.38.782L17.85 19.536"
        />
      </mask>
      <g mask="url(#a)">
        <g filter="url(#b)">
          <ellipse
            cx="2.354"
            cy="6.284"
            fill="#ede6ff"
            rx="2.354"
            ry="6.284"
            transform="rotate(89.814 -4.496 9.333)scale(1 -1)"
          />
        </g>
        <g filter="url(#c)">
          <ellipse
            cx="4.444"
            cy="12.758"
            fill="#ede6ff"
            rx="4.444"
            ry="12.758"
            transform="rotate(89.814 -6.879 -3.19)scale(1 -1)"
          />
        </g>
        <g filter="url(#d)">
          <ellipse
            cx="2.354"
            cy="13.029"
            fill="#4e14ff"
            rx="2.354"
            ry="13.029"
            transform="rotate(89.814 -7.86 -2.7)scale(1 -1)"
          />
        </g>
        <g filter="url(#e)">
          <ellipse
            cx="2.354"
            cy="13.077"
            fill="#4e14ff"
            rx="2.354"
            ry="13.077"
            transform="matrix(.00324 1 1 -.00324 -8.57 12.86)"
          />
        </g>
        <g filter="url(#f)">
          <ellipse
            cx="2.354"
            cy="13.077"
            fill="#4e14ff"
            rx="2.354"
            ry="13.077"
            transform="rotate(269.814 2.697 10.62)scale(-1 1)"
          />
        </g>
        <g filter="url(#g)">
          <ellipse
            cx="6.014"
            cy="9.436"
            fill="#ede6ff"
            rx="6.014"
            ry="9.436"
            transform="rotate(93.35 13.698 24.078)scale(-1 1)"
          />
        </g>
        <g filter="url(#h)">
          <ellipse
            cx="1.483"
            cy="9.189"
            fill="#4e14ff"
            rx="1.483"
            ry="9.189"
            transform="rotate(89.009 15.481 23.943)scale(-1 1)"
          />
        </g>
        <g filter="url(#i)">
          <ellipse
            cx="1.483"
            cy="9.189"
            fill="#4e14ff"
            rx="1.483"
            ry="9.189"
            transform="rotate(89.009 15.481 23.943)scale(-1 1)"
          />
        </g>
        <g filter="url(#j)">
          <ellipse
            cx="6.926"
            cy="4.164"
            fill="#4e14ff"
            rx="1.883"
            ry="12.44"
            transform="rotate(39.51 6.926 4.164)"
          />
        </g>
        <g filter="url(#k)">
          <ellipse
            cx="27.071"
            cy="-2.273"
            fill="#4e14ff"
            rx="1.883"
            ry="12.44"
            transform="rotate(37.892 27.07 -2.273)"
          />
        </g>
        <g filter="url(#l)">
          <ellipse
            cx="24.229"
            cy="4.526"
            fill="#2bfdd2"
            rx="3.539"
            ry="5.339"
            transform="rotate(37.892 24.23 4.526)"
          />
        </g>
        <g filter="url(#m)">
          <ellipse
            cx="5.958"
            cy="16.712"
            fill="#4e14ff"
            rx="1.883"
            ry="12.44"
            transform="rotate(37.892 5.958 16.712)"
          />
        </g>
        <g filter="url(#n)">
          <ellipse
            cx="5.958"
            cy="16.712"
            fill="#4e14ff"
            rx="1.883"
            ry="12.44"
            transform="rotate(37.892 5.958 16.712)"
          />
        </g>
        <g filter="url(#o)">
          <ellipse
            cx="21.904"
            cy="13.039"
            fill="#4e14ff"
            rx="2.001"
            ry="12.44"
            transform="rotate(37.892 21.904 13.039)"
          />
        </g>
        <g filter="url(#p)">
          <ellipse
            cx="23.816"
            cy="14.434"
            fill="#2bfdd2"
            rx="3.437"
            ry="9.003"
            transform="rotate(37.892 23.816 14.434)"
          />
        </g>
      </g>
      <path
        className="fill-[#08060d] dark:fill-white"
        fill="#08060d"
        d="M3.644 0c-3.932 5.628-3.955 14.351 0 20H6.3C2.346 14.35 2.37 5.627 6.3 0zM30.625 10h2.657c-.001-3.593-.99-7.184-2.957-10h-2.656c1.966 2.816 2.955 6.407 2.957 10zM35.314 14.907h-2.665a19 19 0 0 0 .453-2.251h-2.657a19 19 0 0 1-.453 2.251h-2.669a17 17 0 0 1-.944 2.658h2.669A15 15 0 0 1 27.668 20h2.656a15 15 0 0 0 1.38-2.435h2.665c.386-.851.7-1.742.944-2.658"
      />
      <defs>
        <filter
          id="b"
          x="-1.688"
          y="7.232"
          color-interpolation-filters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_318_26118"
            stdDeviation="3.273"
          />
        </filter>
        <filter
          id="c"
          x="-16.579"
          y="-2.889"
          color-interpolation-filters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_318_26118"
            stdDeviation="3.273"
          />
        </filter>
        <filter
          id="d"
          x="-14.454"
          y="1.198"
          color-interpolation-filters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_318_26118"
            stdDeviation="1.964"
          />
        </filter>
        <filter
          id="e"
          x="-12.49"
          y="8.89"
          color-interpolation-filters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_318_26118"
            stdDeviation="1.964"
          />
        </filter>
        <filter
          id="f"
          x="-11.835"
          y="9.381"
          color-interpolation-filters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_318_26118"
            stdDeviation="1.964"
          />
        </filter>
        <filter
          id="g"
          x="13.495"
          y="-7.32"
          color-interpolation-filters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_318_26118"
            stdDeviation="3.273"
          />
        </filter>
        <filter
          id="h"
          x="16.825"
          y="1.306"
          color-interpolation-filters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_318_26118"
            stdDeviation="1.964"
          />
        </filter>
        <filter
          id="i"
          x="16.825"
          y="1.306"
          color-interpolation-filters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_318_26118"
            stdDeviation="1.964"
          />
        </filter>
        <filter
          id="j"
          x="-5.05"
          y="-9.437"
          color-interpolation-filters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_318_26118"
            stdDeviation="1.964"
          />
        </filter>
        <filter
          id="k"
          x="15.358"
          y="-16.087"
          color-interpolation-filters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_318_26118"
            stdDeviation="1.964"
          />
        </filter>
        <filter
          id="l"
          x="15.994"
          y="-4.143"
          color-interpolation-filters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_318_26118"
            stdDeviation="1.964"
          />
        </filter>
        <filter
          id="m"
          x="-5.755"
          y="2.898"
          color-interpolation-filters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_318_26118"
            stdDeviation="1.964"
          />
        </filter>
        <filter
          id="n"
          x="-5.755"
          y="2.898"
          color-interpolation-filters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_318_26118"
            stdDeviation="1.964"
          />
        </filter>
        <filter
          id="o"
          x="10.173"
          y="-.784"
          color-interpolation-filters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_318_26118"
            stdDeviation="1.964"
          />
        </filter>
        <filter
          id="p"
          x="13.728"
          y="3.092"
          color-interpolation-filters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_318_26118"
            stdDeviation="1.964"
          />
        </filter>
      </defs>
    </svg>
  ),
}
